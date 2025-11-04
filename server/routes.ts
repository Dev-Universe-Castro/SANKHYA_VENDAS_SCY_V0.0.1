import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, hashPassword, comparePassword, authMiddleware } from "./auth";
import { encrypt, decrypt } from "./crypto";
import { insertUserSchema, insertEmpresaSchema, insertSyncLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = generateToken({ userId: user.id, email: user.email });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          perfil: user.perfil,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });

  // Protected routes
  app.use("/api/empresas", authMiddleware);
  app.use("/api/logs", authMiddleware);
  app.use("/api/configuracoes", authMiddleware);

  // Empresas CRUD
  app.get("/api/empresas", async (req, res) => {
    try {
      const empresas = await storage.getAllEmpresas();
      
      const empresasComSenhaOculta = empresas.map((e) => ({
        ...e,
        sankhya_password: e.sankhya_password_encrypted ? "********" : undefined,
        sankhya_password_encrypted: undefined,
      }));

      res.json(empresasComSenhaOculta);
    } catch (error) {
      console.error("Error fetching empresas:", error);
      res.status(500).json({ error: "Erro ao buscar empresas" });
    }
  });

  app.get("/api/empresas/:id", async (req, res) => {
    try {
      const empresa = await storage.getEmpresaById(req.params.id);
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      const empresaComSenhaOculta = {
        ...empresa,
        sankhya_password: empresa.sankhya_password_encrypted ? "********" : undefined,
        sankhya_password_encrypted: undefined,
      };

      res.json(empresaComSenhaOculta);
    } catch (error) {
      console.error("Error fetching empresa:", error);
      res.status(500).json({ error: "Erro ao buscar empresa" });
    }
  });

  app.post("/api/empresas", async (req, res) => {
    try {
      const { sankhya_password, ...rest } = req.body;
      
      const empresaData = {
        ...rest,
        sankhya_password_encrypted: sankhya_password ? encrypt(sankhya_password) : undefined,
      };

      const validatedData = insertEmpresaSchema.parse(empresaData);
      const empresa = await storage.createEmpresa(validatedData);

      const empresaComSenhaOculta = {
        ...empresa,
        sankhya_password: "********",
        sankhya_password_encrypted: undefined,
      };

      res.status(201).json(empresaComSenhaOculta);
    } catch (error: any) {
      console.error("Error creating empresa:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar empresa" });
    }
  });

  app.patch("/api/empresas/:id", async (req, res) => {
    try {
      const { sankhya_password, ...rest } = req.body;
      
      const updateData: any = { ...rest };
      if (sankhya_password && sankhya_password !== "********") {
        updateData.sankhya_password_encrypted = encrypt(sankhya_password);
      }

      const empresa = await storage.updateEmpresa(req.params.id, updateData);
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      const empresaComSenhaOculta = {
        ...empresa,
        sankhya_password: "********",
        sankhya_password_encrypted: undefined,
      };

      res.json(empresaComSenhaOculta);
    } catch (error) {
      console.error("Error updating empresa:", error);
      res.status(500).json({ error: "Erro ao atualizar empresa" });
    }
  });

  app.delete("/api/empresas/:id", async (req, res) => {
    try {
      await storage.deleteEmpresa(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting empresa:", error);
      res.status(500).json({ error: "Erro ao deletar empresa" });
    }
  });

  // Sync logs
  app.get("/api/logs", async (req, res) => {
    try {
      const { empresa_id, tipo, status } = req.query;
      
      const filters: any = {};
      if (empresa_id) filters.empresa_id = empresa_id as string;
      if (tipo) filters.tipo = tipo as string;
      if (status) filters.status = status as string;

      const logs = await storage.getAllSyncLogs(filters);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Erro ao buscar logs" });
    }
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const validatedData = insertSyncLogSchema.parse(req.body);
      const log = await storage.createSyncLog(validatedData);
      res.status(201).json(log);
    } catch (error: any) {
      console.error("Error creating log:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar log" });
    }
  });

  // Configurações
  app.get("/api/configuracoes", async (req, res) => {
    try {
      const configs = await storage.getAllConfiguracoes();
      
      const configMap = configs.reduce((acc, config) => {
        acc[config.chave] = config.valor;
        return acc;
      }, {} as Record<string, string>);

      res.json(configMap);
    } catch (error) {
      console.error("Error fetching configuracoes:", error);
      res.status(500).json({ error: "Erro ao buscar configurações" });
    }
  });

  app.post("/api/configuracoes", async (req, res) => {
    try {
      const { chave, valor } = req.body;
      
      if (!chave || !valor) {
        return res.status(400).json({ error: "Chave e valor são obrigatórios" });
      }

      const config = await storage.setConfiguracao({ chave, valor });
      res.json(config);
    } catch (error) {
      console.error("Error saving configuracao:", error);
      res.status(500).json({ error: "Erro ao salvar configuração" });
    }
  });

  // Manual sync endpoint
  app.post("/api/sincronizar", authMiddleware, async (req, res) => {
    try {
      const { empresa_id } = req.body;
      
      // TODO: This would trigger the Celery worker task
      // For now, just create a log entry
      console.log("Manual sync triggered for empresa:", empresa_id || "all");
      
      res.json({ message: "Sincronização iniciada", empresa_id: empresa_id || "all" });
    } catch (error) {
      console.error("Error triggering sync:", error);
      res.status(500).json({ error: "Erro ao iniciar sincronização" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
