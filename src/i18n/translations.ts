export const translations = {
  "pt-BR": {
    // Dashboard
    "dashboard": "Dashboard",
    "totalLeads": "Total de Leads",
    "recentLeads": "Leads Recentes",
    "withTags": "Com Tags",
    "withEmail": "Com Email",
    "withPhone": "Com Telefone",
    "withWebsite": "Com Website",
    "last30Days": "Últimos 30 dias",
    "leadsWithTags": "Leads com tags",
    "contactsWithEmail": "Contatos com email",
    "contactsWithPhone": "Contatos com telefone",
    "withSite": "Com site",
    
    // Auth
    "login": "Login",
    "signup": "Cadastro",
    "email": "Email",
    "password": "Senha",
    "loginSuccess": "Login realizado",
    "welcomeBack": "Bem-vindo de volta!",
    
    // Config
    "settings": "Configurações",
    "language": "Idioma",
    "selectLanguage": "Selecione o idioma",
    "notifications": "Notificações",
    "theme": "Tema",
    "webhooks": "Webhooks",
    "applySettings": "Aplicar Configurações",
    "settingsApplied": "Configurações aplicadas",
    "settingsError": "Erro ao aplicar configurações",
    
    // Common
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "edit": "Editar",
    "search": "Buscar",
    "noResults": "Nenhum resultado encontrado",
  },
  "en": {
    // Dashboard
    "dashboard": "Dashboard",
    "totalLeads": "Total Leads",
    "recentLeads": "Recent Leads",
    "withTags": "With Tags",
    "withEmail": "With Email",
    "withPhone": "With Phone",
    "withWebsite": "With Website",
    "last30Days": "Last 30 days",
    "leadsWithTags": "Leads with tags",
    "contactsWithEmail": "Contacts with email",
    "contactsWithPhone": "Contacts with phone",
    "withSite": "With website",
    
    // Auth
    "login": "Login",
    "signup": "Sign Up",
    "email": "Email",
    "password": "Password",
    "loginSuccess": "Login successful",
    "welcomeBack": "Welcome back!",
    
    // Config
    "settings": "Settings",
    "language": "Language",
    "selectLanguage": "Select language",
    "notifications": "Notifications",
    "theme": "Theme",
    "webhooks": "Webhooks",
    "applySettings": "Apply Settings",
    "settingsApplied": "Settings applied",
    "settingsError": "Error applying settings",
    
    // Common
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "noResults": "No results found",
  },
  "es": {
    // Dashboard
    "dashboard": "Dashboard",
    "totalLeads": "Total de Leads",
    "recentLeads": "Leads Recientes",
    "withTags": "Con Etiquetas",
    "withEmail": "Con Email",
    "withPhone": "Con Teléfono",
    "withWebsite": "Con Sitio Web",
    "last30Days": "Últimos 30 días",
    "leadsWithTags": "Leads con etiquetas",
    "contactsWithEmail": "Contactos con email",
    "contactsWithPhone": "Contactos con teléfono",
    "withSite": "Con sitio web",
    
    // Auth
    "login": "Iniciar Sesión",
    "signup": "Registrarse",
    "email": "Email",
    "password": "Contraseña",
    "loginSuccess": "Inicio de sesión exitoso",
    "welcomeBack": "¡Bienvenido de vuelta!",
    
    // Config
    "settings": "Configuración",
    "language": "Idioma",
    "selectLanguage": "Seleccionar idioma",
    "notifications": "Notificaciones",
    "theme": "Tema",
    "webhooks": "Webhooks",
    "applySettings": "Aplicar Configuración",
    "settingsApplied": "Configuración aplicada",
    "settingsError": "Error al aplicar la configuración",
    
    // Common
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "search": "Buscar",
    "noResults": "No se encontraron resultados",
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations["pt-BR"];