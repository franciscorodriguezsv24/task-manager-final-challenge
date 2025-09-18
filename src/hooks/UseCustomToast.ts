// hooks/useCustomToast.ts
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

const toastStyles = {
  success: {
    background: "#1b2716",
    color: "#70B252",
    border: "1px solid #70B252",
  },
  error: {
    background: "#401b17",
    color: "#DA584B",
    border: "1px solid #DA584B",
  },
  warning: {
    background: "#221b0be1",
    color: "#E5B454",
    border: "1px solid #E5B454",
  },
  info: {
    background: "#303132",
    color: "#ffffff",
    border: "1px solid #ffffff",
  },
};

export const useCustomToast = () => {
  const showToast = (type: ToastType, message: string | React.ReactNode) => {
    const style = toastStyles[type];

    switch (type) {
      case "success":
        return toast.success(message, { style });
      case "error":
        return toast.error(message, { style });
      case "warning":
        return toast.warning(message, { style });
      case "info":
        return toast.info(message, { style });
      default:
        return toast(message, { style: toastStyles.info });
    }
  };

  return { showToast };
};
