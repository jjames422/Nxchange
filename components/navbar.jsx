"use client";

import { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import siteConfig from "@/config/site";
import Sidebar from "@/components/sidebar";

export default function CustomNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <Navbar>
        <NavbarContent justify="start">
          <NavbarBrand>
            <a href={siteConfig.links.home} className="text-lg font-bold text-primary">NxChange</a>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" href={siteConfig.links.signup}>Sign Up</Button>
          </NavbarItem>
          <NavbarMenuToggle onClick={toggleMenu} className="ml-4" />
        </NavbarContent>
      </Navbar>
      <Sidebar isOpen={menuOpen} onClose={toggleMenu} />
    </>
  );
}
