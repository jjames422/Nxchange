"use client";

import { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle } from "@nextui-org/navbar";
import { Icon } from "@iconify/react";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <Navbar>
      <NavbarContent justify="start">
        <NavbarMenuToggle onClick={toggleMenu} />
        <NavbarBrand>
          <a href="/dashboard" className="text-lg font-bold text-primary">NxChange</a>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Icon icon="mdi:bell" width={24} />
        </NavbarItem>
        <NavbarItem>
          <Icon icon="mdi:menu" width={24} />
        </NavbarItem>
        <NavbarItem>
          <Icon icon="mdi:account-circle" width={24} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
