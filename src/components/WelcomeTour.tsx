import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, Status } from "react-joyride";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function WelcomeTour() {
  const [run, setRun] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const steps: Step[] = [
    {
      target: "body",
      content: t("welcomeTour"),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".sidebar-menu",
      content: t("sidebarTour"),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: "[data-tour='prospect']",
      content: t("prospectTour"),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: "[data-tour='leads']",
      content: t("leadsTour"),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: "[data-tour='reports']",
      content: t("reportsTour"),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: "[data-tour='config']",
      content: t("configTour"),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: ".user-profile",
      content: t("profileTour"),
      placement: "left",
      disableBeacon: true,
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as Status)) {
      setRun(false);
      localStorage.setItem("tourCompleted", "true");
      toast({
        title: t("tourCompleted"),
        description: t("tourCompletedDesc"),
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
          zIndex: 1000,
          arrowColor: "#fff",
          backgroundColor: "#fff",
          textColor: "#333",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        },
        tooltip: {
          padding: 16,
          borderRadius: 8,
        },
        buttonNext: {
          backgroundColor: "#3080a3",
          padding: "8px 16px",
          borderRadius: 4,
        },
        buttonBack: {
          marginRight: 8,
          padding: "8px 16px",
          borderRadius: 4,
        },
        buttonSkip: {
          padding: "8px 16px",
          borderRadius: 4,
        }
      }}
    />
  );
}