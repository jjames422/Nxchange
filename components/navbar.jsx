'use client';

import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import siteConfig from '@/config/site';
import Sidebar from '@/components/sidebar';

const CustomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <a href={siteConfig.links.home} className="text-2xl font-bold text-primary">NxChange</a>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as="a" href={siteConfig.links.signup} color="primary">Sign Up</Button>
          </NavbarItem>
          <NavbarItem>
            <NavbarMenuToggle onClick={toggleMenu} />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Sidebar isOpen={menuOpen} onClose={toggleMenu} />
    </>
  );
};

export default CustomNavbar;
