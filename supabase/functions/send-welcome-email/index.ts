import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();
    console.log("Sending welcome email to:", email, "name:", name);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bem-vindo ao nosso sistema!</h2>
        <p>Olá ${name || ""},</p>
        <p>Ficamos muito felizes em ter você conosco! Seu cadastro foi realizado com sucesso.</p>
        <p>Você já pode fazer login e começar a usar nossa plataforma.</p>
        <p>Você tem 14 dias de teste gratuito para explorar todas as funcionalidades.</p>
        <p>Se tiver alguma dúvida, não hesite em nos contatar.</p>
        <p>Atenciosamente,<br>Equipe do Sistema</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Washington <washington.hardtec@gmail.com>",
        to: [email],
        subject: "Bem-vindo ao Sistema!",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending welcome email:", error);
      
      // Instead of throwing an error, we'll return success even if email fails
      // This way the user registration process continues
      return new Response(
        JSON.stringify({ 
          status: "warning",
          message: "User registered successfully but welcome email could not be sent"
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    
    // Return success response even if email fails
    return new Response(
      JSON.stringify({ 
        status: "warning",
        message: "User registered successfully but welcome email could not be sent"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
};

serve(handler);