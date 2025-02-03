import { TouchableOpacity } from "react-native";
import React from "react";

interface CircleButtonProps {
  onPress?: () => void;
  content: React.ReactElement;
  className: string;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  content,
  className,
}) => {
  return (
    <TouchableOpacity
      className={`z-50 w-20 h-20 bg-secondary-yellow rounded-full flex items-center justify-center font-light ${className}`}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
};

export default CircleButton;
