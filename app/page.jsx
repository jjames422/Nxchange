import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 mt-8">
      <Card>
        <CardHeader>
          <h1 className="text-5xl font-bold text-left">
            The future of <span className="text-primary-500">Money</span> is here
          </h1>
        </CardHeader>
        <CardBody>
          <p className="text-xl text-left mb-4">
            We&apos;re the most trusted place for people and businesses to buy, sell, and use crypto.
          </p>
          <div className="flex justify-center mb-4">
            <Input
              isDisabled={false}
              type="email"
              label="Email"
              defaultValue=""
              placeholder="Enter your email"
              className="max-w-xs"
            />
          </div>
          <div className="flex justify-center">
            <Button color="primary" className="w-full max-w-xs">Get Started</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
