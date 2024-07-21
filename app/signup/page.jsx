"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Link, Divider } from "@nextui-org/react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
import { Icon } from "@iconify/react";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default function SignUp() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await prisma.user.create({
        data: { email, passwordHash: hashedPassword },
      });
      router.push("/signin");
    }
  };

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  const orDivider = (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="shrink-0 text-tiny text-default-500">OR</p>
      <Divider className="flex-1" />
    </div>
  );

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <LazyMotion features={domAnimation}>
          <h1 className="mb-4 text-xl font-medium">Sign Up</h1>
          <AnimatePresence initial={false} mode="popLayout">
            {isFormVisible ? (
              <m.form
                animate="visible"
                className="flex flex-col gap-y-3"
                exit="hidden"
                initial="hidden"
                variants={variants}
                onSubmit={handleSubmit}
              >
                <Input
                  autoFocus
                  isRequired
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  isRequired
                  label="Password"
                  name="password"
                  type="password"
                  variant="bordered"
                  onChange={handlePasswordChange}
                  isInvalid={passwordError}
                  errorMessage={passwordError ? "Passwords do not match" : ""}
                />

                <Input
                  isRequired
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="bordered"
                  onChange={handleConfirmPasswordChange}
                  isInvalid={passwordError}
                  errorMessage={passwordError ? "Passwords do not match" : ""}
                />

                <Button color="primary" type="submit" className="w-full">
                  Sign Up
                </Button>
                {orDivider}
                <Button
                  fullWidth
                  startContent={
                    <Icon className="text-default-500" icon="solar:arrow-left-linear" width={18} />
                  }
                  variant="flat"
                  onPress={() => setIsFormVisible(false)}
                >
                  Other Sign Up options
                </Button>
              </m.form>
            ) : (
              <>
                <Button
                  fullWidth
                  color="primary"
                  startContent={
                    <Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />
                  }
                  type="button"
                  onPress={() => setIsFormVisible(true)}
                >
                  Continue with Email
                </Button>
                {orDivider}
                <m.div
                  animate="visible"
                  className="flex flex-col gap-y-2"
                  exit="hidden"
                  initial="hidden"
                  variants={variants}
                >
                  <Button
                    fullWidth
                    startContent={<Icon icon="flat-color-icons:google" width={24} />}
                    variant="flat"
                  >
                    Continue with Google
                  </Button>
                  <Button
                    fullWidth
                    startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
                    variant="flat"
                  >
                    Continue with GitHub
                  </Button>
                  <p className="mt-3 text-center text-small">
                    Already have an account?&nbsp;
                    <Link href="/signin" size="sm">
                      Log In
                    </Link>
                  </p>
                </m.div>
              </>
            )}
          </AnimatePresence>
        </LazyMotion>
      </div>
    </div>
  );
}
