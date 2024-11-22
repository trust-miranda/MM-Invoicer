import HeaderBox from "@/components/ui/HeaderBox";
import RossumInvoices from "@/components/ui/RossumInvoices";
import Chatbot from "@/components/ui/ChatBot/ChatBot";
import { Card } from "@/components/ui/card";

const Rossum: React.FC = () => {
  return (
    <section className="rossum p-4">
      <div className="rossum-content p-4">
        <header className="rossum-header mb-12">
          <HeaderBox type="title" title="CONTAS A PAGAR" subtext="" />
        </header>
        <Card className="relative bg-white flex-1 items-center justify-center my-2 mx-2 overflow-x-hidden">
          <div className="items-center justify-center">
            <Chatbot
              apiKey="sk-7v-rQd0SW6MNYA7yZ3KeWI-O713V8nQuN94y7HQgC3T3BlbkFJL29Z0FZ83NL6IJiyk3Fg1-fDU-3DFrDJTlRTeJen8A"
              assistantId="asst_x6fU4z9QqdhKiz9BbPPRQHHz"
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Rossum;
