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

export const statuses = [
  {
    value: "Backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Por Tratar",
    label: "Por Tratar",
    icon: CircleIcon,
  },
  {
    value: "Em Progresso",
    label: "Em Progresso",
    icon: StopwatchIcon,
  },
  {
    value: "Concluída",
    label: "Concluída",
    icon: CheckCircledIcon,
  },
  {
    value: "Cancelada",
    label: "Cancelada",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Baixa",
    value: "Baixa",
    icon: ArrowDownIcon,
  },
  {
    label: "Média",
    value: "Média",
    icon: ArrowRightIcon,
  },
  {
    label: "Alta",
    value: "Alta",
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
