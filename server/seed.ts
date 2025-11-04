import { db } from "./db";
import { users, empresas, syncLogs, configuracoes } from "@shared/schema";
import { hashPassword } from "./auth";
import { encrypt } from "./crypto";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@central.com",
      password: hashedPassword,
      nome: "Administrador",
      perfil: "ADM",
    })
    .onConflictDoNothing()
    .returning();

  if (adminUser) {
    console.log("✅ Admin user created: admin@central.com / admin123");
  }

  // Create sample companies
  const empresaSamples = [
    {
      nome: "Empresa Alpha Ltda",
      ativo: true,
      sankhya_endpoint: "https://api.sankhya.com.br/alpha",
      sankhya_app_key: "ALPHA_APP_KEY_123",
      sankhya_username: "alpha_user",
      sankhya_password_encrypted: encrypt("alpha_pass"),
    },
    {
      nome: "Empresa Beta S.A.",
      ativo: true,
      sankhya_endpoint: "https://api.sankhya.com.br/beta",
      sankhya_app_key: "BETA_APP_KEY_456",
      sankhya_username: "beta_user",
      sankhya_password_encrypted: encrypt("beta_pass"),
    },
    {
      nome: "Empresa Gamma Corp",
      ativo: false,
      sankhya_endpoint: "https://api.sankhya.com.br/gamma",
      sankhya_app_key: "GAMMA_APP_KEY_789",
      sankhya_username: "gamma_user",
      sankhya_password_encrypted: encrypt("gamma_pass"),
    },
  ];

  const createdEmpresas = await db
    .insert(empresas)
    .values(empresaSamples)
    .onConflictDoNothing()
    .returning();

  if (createdEmpresas.length > 0) {
    console.log(`✅ Created ${createdEmpresas.length} sample companies`);

    // Create sample sync logs
    const logSamples = [];
    for (const empresa of createdEmpresas) {
      logSamples.push(
        {
          empresa_id: empresa.id,
          tipo: "IN",
          status: "SINCRONIZADO",
          duracao: "2.3s",
          detalhes: "Importação de 150 registros do Sankhya concluída com sucesso.",
          erro: null,
        },
        {
          empresa_id: empresa.id,
          tipo: "OUT",
          status: "PENDENTE_ENVIO",
          duracao: null,
          detalhes: "Aguardando processamento da fila de sincronização.",
          erro: null,
        },
        {
          empresa_id: empresa.id,
          tipo: "IN",
          status: "FALHA_ENVIO",
          duracao: "1.8s",
          detalhes: "Erro: Token expirado. Código 401 - Unauthorized.",
          erro: JSON.stringify({ code: 401, message: "Token expired" }),
        }
      );
    }

    await db.insert(syncLogs).values(logSamples).onConflictDoNothing();
    console.log(`✅ Created ${logSamples.length} sample sync logs`);
  }

  // Create default configurations
  const configSamples = [
    { chave: "sync_interval", valor: "15" },
    { chave: "sync_interval_unit", valor: "minutos" },
    { chave: "retry_attempts", valor: "3" },
    { chave: "retry_delay", valor: "5" },
    { chave: "api_timeout", valor: "30" },
  ];

  const createdConfigs = await db
    .insert(configuracoes)
    .values(configSamples)
    .onConflictDoNothing()
    .returning();

  if (createdConfigs.length > 0) {
    console.log(`✅ Created ${createdConfigs.length} default configurations`);
  }

  console.log("🎉 Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
