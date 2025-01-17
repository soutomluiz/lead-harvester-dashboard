import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, Status } from "react-joyride";
import { useToast } from "@/components/ui/use-toast";

export function WelcomeTour() {
  const [run, setRun] = useState(true);
  const { toast } = useToast();

  const steps: Step[] = [
    {
      target: "body",
      content: "Bem-vindo ao nosso software! Vamos fazer um tour rápido para você conhecer as principais funcionalidades.",
      placement: "center",
    },
    {
      target: ".prospect-section",
      content: "Aqui você pode prospectar leads de forma automática usando o Google Places ou extraindo de websites.",
    },
    {
      target: ".leads-section",
      content: "Nesta seção você pode visualizar e gerenciar todos os seus leads.",
    },
    {
      target: ".config-section",
      content: "Configure suas chaves de API e outras configurações importantes aqui.",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem("tourCompleted", "true");
      toast({
        title: "Tour concluído!",
        description: "Agora você já conhece as principais funcionalidades do sistema.",
      });
    }
  };

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (tourCompleted) {
      setRun(false);
    }
  }, []);

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#3080a3",
        },
      }}
    />
  );
}