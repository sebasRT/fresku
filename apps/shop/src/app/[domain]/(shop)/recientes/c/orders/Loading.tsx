import { cn } from "@/utils/functions/styles";
import styles from "./recentOrders.module.scss";
const LoadingRecentOrders = () => {
  return (
    <div
      className={cn(
        styles.ordersList,
        "*:animate-pulse *:h-[2rem] *:w-full *:bg-gray-200 "
      )}
    >
      <div />
      <div />
    </div>
  );
};

export default LoadingRecentOrders;
