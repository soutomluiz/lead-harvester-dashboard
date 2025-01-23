export type Language = "pt-BR" | "en" | "es";
export type TranslationKey = keyof typeof translations["pt-BR"];

export const translations = {
  "pt-BR": {
    "welcomeTour": "Bem-vindo ao nosso sistema! Vamos fazer um tour rápido para você conhecer as principais funcionalidades.",
    "sidebarTour": "Este é o menu principal, onde você pode navegar entre todas as funcionalidades do sistema.",
    "prospectTour": "Aqui você pode prospectar leads de forma automática usando o Google Places ou extraindo de websites.",
    "leadsTour": "Nesta seção você gerencia todos os seus leads, com kanban, timeline e sistema de pontuação.",
    "reportsTour": "Visualize relatórios e métricas importantes sobre seus leads e vendas.",
    "configTour": "Configure suas preferências, integrações e personalize o sistema.",
    "profileTour": "Acesse seu perfil, configurações e faça logout do sistema.",
    "tourCompleted": "Tour concluído!",
    "tourCompletedDesc": "Agora você já conhece as principais funcionalidades do sistema. Bom trabalho!",
    
    // Dashboard translations
    "totalLeads": "Total de Leads",
    "recentLeads": "Leads Recentes",
    "withTags": "Com Tags",
    "withEmail": "Com Email",
    "withPhone": "Com Telefone",
    "withWebsite": "Com Website",
    "leadsRegistered": "Leads registrados",
    "last30Days": "Últimos 30 dias",
    "leadsWithTags": "Leads com tags",
    "contactsWithEmail": "Contatos com email",
    "contactsWithPhone": "Contatos com telefone",
    "withSite": "Com site",
    "leadsOverTime": "Leads ao Longo do Tempo",
    "leadsStatus": "Status dos Leads",
    "leadsOrigin": "Origem dos Leads",
    "topIndustries": "Principais Indústrias",
    "websitesFound": "Websites Encontrados",
    "withContactInfo": "Com Informações de Contato",
    "uniqueDomains": "Domínios Únicos",
    "companiesFound": "Empresas Encontradas",
    "averageRating": "Avaliação Média",
    
    // Navigation and general
    "dashboard": "Dashboard",
    "manualInput": "Entrada Manual",
    "googleMaps": "Google Maps",
    "websites": "Websites",
    "leadsList": "Lista de Leads",
    "leadScore": "Pontuação de Leads",
    "timeline": "Timeline",
    "reports": "Relatórios",
    "subscription": "Assinatura",
    "settings": "Configurações",
    "language": "Idioma",
    "selectLanguage": "Selecione o idioma",
    
    // Settings and configuration
    "settingsApplied": "Configurações aplicadas",
    "success": "Sucesso",
    "error": "Erro",
    "settingsError": "Erro ao aplicar configurações",
    "loading": "Carregando...",
    "applySettings": "Aplicar Configurações",
    
    // Export Settings
    "exportSettings": "Configurações de Exportação",
    "defaultExportFormat": "Formato padrão de exportação",
    "selectFormat": "Selecione o formato",
    
    // Display Settings
    "displaySettings": "Configurações de Visualização",
    "itemsPerPage": "Itens por página",
    "selectItemsPerPage": "Selecione a quantidade",
    
    // Email Notifications
    "emailNotifications": "Notificações por Email",
    "newLeadNotification": "Novos leads",
    "leadStatusNotification": "Mudanças de status",
    "dailySummaryNotification": "Resumo diário",
    "weeklyReportNotification": "Relatório semanal",
    
    // Calendar Integration
    "calendarIntegration": "Integração com Calendário",
    "enableCalendarSync": "Ativar sincronização",
    "calendarUrl": "URL do calendário",

    // Other
    "addLeads": "Adicionar Leads",
    "leads": "Leads",
    "support": "Suporte",
    "version": "Versão",
    "hello": "Olá",
    "profile": "Perfil",
    "notifications": "Notificações",
    "browserNotifications": "Notificações do navegador",
    "soundNotifications": "Notificações sonoras"
  },
  "en": {
    "welcomeTour": "Welcome to our system! Let's take a quick tour to show you the main features.",
    "sidebarTour": "This is the main menu, where you can navigate through all system features.",
    "prospectTour": "Here you can prospect leads automatically using Google Places or by extracting from websites.",
    "leadsTour": "In this section you manage all your leads, with kanban, timeline and scoring system.",
    "reportsTour": "View important reports and metrics about your leads and sales.",
    "configTour": "Configure your preferences, integrations and customize the system.",
    "profileTour": "Access your profile, settings and logout from the system.",
    "tourCompleted": "Tour completed!",
    "tourCompletedDesc": "Now you know the main features of the system. Good job!",
    
    // Dashboard translations
    "totalLeads": "Total Leads",
    "recentLeads": "Recent Leads",
    "withTags": "With Tags",
    "withEmail": "With Email",
    "withPhone": "With Phone",
    "withWebsite": "With Website",
    "leadsRegistered": "Leads Registered",
    "last30Days": "Last 30 Days",
    "leadsWithTags": "Leads with Tags",
    "contactsWithEmail": "Contacts with Email",
    "contactsWithPhone": "Contacts with Phone",
    "withSite": "With Site",
    "leadsOverTime": "Leads Over Time",
    "leadsStatus": "Leads Status",
    "leadsOrigin": "Leads Origin",
    "topIndustries": "Top Industries",
    "websitesFound": "Websites Found",
    "withContactInfo": "With Contact Info",
    "uniqueDomains": "Unique Domains",
    "companiesFound": "Companies Found",
    "averageRating": "Average Rating",
    
    // Navigation and general
    "dashboard": "Dashboard",
    "manualInput": "Manual Input",
    "googleMaps": "Google Maps",
    "websites": "Websites",
    "leadsList": "Leads List",
    "leadScore": "Lead Score",
    "timeline": "Timeline",
    "reports": "Reports",
    "subscription": "Subscription",
    "settings": "Settings",
    "language": "Language",
    "selectLanguage": "Select Language",
    
    // Settings and configuration
    "settingsApplied": "Settings Applied",
    "success": "Success",
    "error": "Error",
    "settingsError": "Error applying settings",
    "loading": "Loading...",
    "applySettings": "Apply Settings",
    
    // Export Settings
    "exportSettings": "Export Settings",
    "defaultExportFormat": "Default export format",
    "selectFormat": "Select format",
    
    // Display Settings
    "displaySettings": "Display Settings",
    "itemsPerPage": "Items per page",
    "selectItemsPerPage": "Select quantity",
    
    // Email Notifications
    "emailNotifications": "Email Notifications",
    "newLeadNotification": "New leads",
    "leadStatusNotification": "Status changes",
    "dailySummaryNotification": "Daily summary",
    "weeklyReportNotification": "Weekly report",
    
    // Calendar Integration
    "calendarIntegration": "Calendar Integration",
    "enableCalendarSync": "Enable synchronization",
    "calendarUrl": "Calendar URL",

    // Other
    "addLeads": "Add Leads",
    "leads": "Leads",
    "support": "Support",
    "version": "Version",
    "hello": "Hello",
    "profile": "Profile",
    "notifications": "Notifications",
    "browserNotifications": "Browser notifications",
    "soundNotifications": "Sound notifications"
  },
  "es": {
    "welcomeTour": "¡Bienvenido a nuestro sistema! Hagamos un recorrido rápido para mostrarle las características principales.",
    "sidebarTour": "Este es el menú principal, donde puede navegar por todas las funciones del sistema.",
    "prospectTour": "Aquí puede prospectar leads automáticamente usando Google Places o extrayendo de sitios web.",
    "leadsTour": "En esta sección administra todos sus leads, con kanban, línea de tiempo y sistema de puntuación.",
    "reportsTour": "Vea informes y métricas importantes sobre sus leads y ventas.",
    "configTour": "Configure sus preferencias, integraciones y personalice el sistema.",
    "profileTour": "Acceda a su perfil, configuración y cierre sesión en el sistema.",
    "tourCompleted": "¡Recorrido completado!",
    "tourCompletedDesc": "Ahora conoce las principales características del sistema. ¡Buen trabajo!",
    
    // Dashboard translations
    "totalLeads": "Total de Leads",
    "recentLeads": "Leads Recientes",
    "withTags": "Con Etiquetas",
    "withEmail": "Con Correo Electrónico",
    "withPhone": "Con Teléfono",
    "withWebsite": "Con Sitio Web",
    "leadsRegistered": "Leads Registrados",
    "last30Days": "Últimos 30 Días",
    "leadsWithTags": "Leads con Etiquetas",
    "contactsWithEmail": "Contactos con Correo",
    "contactsWithPhone": "Contactos con Teléfono",
    "withSite": "Con Sitio",
    "leadsOverTime": "Leads a lo Largo del Tiempo",
    "leadsStatus": "Estado de los Leads",
    "leadsOrigin": "Origen de los Leads",
    "topIndustries": "Principales Industrias",
    "websitesFound": "Sitios Web Encontrados",
    "withContactInfo": "Con Información de Contacto",
    "uniqueDomains": "Dominios Únicos",
    "companiesFound": "Empresas Encontradas",
    "averageRating": "Calificación Promedio",
    
    // Navigation and general
    "dashboard": "Tablero",
    "manualInput": "Entrada Manual",
    "googleMaps": "Google Maps",
    "websites": "Sitios Web",
    "leadsList": "Lista de Leads",
    "leadScore": "Puntuación de Leads",
    "timeline": "Línea de Tiempo",
    "reports": "Informes",
    "subscription": "Suscripción",
    "settings": "Configuraciones",
    "language": "Idioma",
    "selectLanguage": "Seleccione el idioma",
    
    // Settings and configuration
    "settingsApplied": "Configuraciones Aplicadas",
    "success": "Éxito",
    "error": "Error",
    "settingsError": "Error al aplicar configuraciones",
    "loading": "Cargando...",
    "applySettings": "Aplicar Configuraciones",
    
    // Export Settings
    "exportSettings": "Configuración de Exportación",
    "defaultExportFormat": "Formato de exportación predeterminado",
    "selectFormat": "Seleccionar formato",
    
    // Display Settings
    "displaySettings": "Configuración de Visualización",
    "itemsPerPage": "Elementos por página",
    "selectItemsPerPage": "Seleccionar cantidad",
    
    // Email Notifications
    "emailNotifications": "Notificaciones por Correo",
    "newLeadNotification": "Nuevos leads",
    "leadStatusNotification": "Cambios de estado",
    "dailySummaryNotification": "Resumen diario",
    "weeklyReportNotification": "Informe semanal",
    
    // Calendar Integration
    "calendarIntegration": "Integración de Calendario",
    "enableCalendarSync": "Activar sincronización",
    "calendarUrl": "URL del calendario",

    // Other
    "addLeads": "Agregar Leads",
    "leads": "Leads",
    "support": "Soporte",
    "version": "Versión",
    "hello": "Hola",
    "profile": "Perfil",
    "notifications": "Notificaciones",
    "browserNotifications": "Notificaciones del navegador",
    "soundNotifications": "Notificaciones sonoras"
  }
};
