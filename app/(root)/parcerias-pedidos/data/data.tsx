import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "medis",
    label: "Preço Médis",
  },
];

export const badgeVariants = {
  default: "bg-gray-200 text-gray-800",

  secondary: "bg-blue-200 text-blue-800",

  destructive: "bg-red-200 text-red-800",

  outline: "border border-gray-200 text-gray-800",
};

export const statuses = [
  {
    value: "Cancelado",
    label: "Cancelado",
    icon: CrossCircledIcon,
    variant: badgeVariants.destructive,
  },
  {
    value: "Por Tratar",
    label: "Por Tratar",
    icon: CircleIcon,
    variant: badgeVariants.default,
  },
  {
    value: "Em Progresso",
    label: "Em Progresso",
    icon: StopwatchIcon,
    variant: badgeVariants.secondary,
  },
  {
    value: "Concluído",
    label: "Concluído",
    icon: CheckCircledIcon,
    variant: badgeVariants.outline,
  },
];

export const priorities = [
  {
    label: "Pouco Urgente",
    value: "Pouco Urgente",
    icon: ArrowDownIcon,
  },
  {
    label: "Urgente",
    value: "Urgente",
    icon: ArrowRightIcon,
  },
  {
    label: "Muito Urgente",
    value: "Muito Urgente",
    icon: ArrowUpIcon,
  },
];

export const clients = [
  {
    label: "AGEAS",
    value: "AGEAS",
    icon: ArrowUpIcon,
  },
  {
    label: "Allianz",
    value: "Allianz",
    icon: ArrowUpIcon,
  },
  {
    label: "AON",
    value: "AON",
    icon: ArrowUpIcon,
  },
  {
    label: "CA Seguros",
    value: "CA Seguros",
    icon: ArrowUpIcon,
  },
  {
    label: "Generali",
    value: "Generali",
    icon: ArrowUpIcon,
  },
  {
    label: "UNA",
    value: "UNA",
    icon: ArrowUpIcon,
  },
  {
    label: "Victoria",
    value: "Victoria",
    icon: ArrowUpIcon,
  },
  {
    label: "Zurich",
    value: "Zurich",
    icon: ArrowUpIcon,
  },
];
