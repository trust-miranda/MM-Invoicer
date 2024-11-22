"use client";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  amount: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  amount,
  suffix,
}) => {
  return (
    <div className="w-full">
      <CountUp
        duration={2}
        decimals={0}
        decimal=","
        prefix=""
        end={amount}
        suffix={suffix}
      />
    </div>
  );
};

export default AnimatedCounter;
