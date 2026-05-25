import { cn } from "@/utils/functions/styles";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", style = {} }) => {
  return (
    <div
      className={cn("animate-pulse h-full w-full  ", className)}
      style={{ backgroundColor: "rgb(209, 213, 219)", ...style }}
    />
  );
};

export default Skeleton;
