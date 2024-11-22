import { logoutAccount } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface FooterProps {
  user: { name: string; email: string };
  type?: "desktop" | "mobile";
  isSidebarCollapsed: boolean;
}

const Footer = ({
  user,
  type = "desktop",
  isSidebarCollapsed,
}: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) router.push("/sign-in");
  };

  return (
    <footer className="footer">
      <div
        className={`${
          isSidebarCollapsed
            ? "hidden"
            : type === "mobile"
              ? "footer_email-mobile"
              : "footer_email"
        }`}
      >
        <h1 className="text-xs truncate font-semibold text-[#dbdbdb]">
          {user?.name}
        </h1>
        <p className="text-xs truncate font-normal text-[#dbdbdb]">
          {user?.email}
        </p>
      </div>
      <div className="footer_image" onClick={handleLogOut}>
        <Image src="icons/logout.svg" fill alt="trust" />
      </div>
    </footer>
  );
};

export default Footer;
