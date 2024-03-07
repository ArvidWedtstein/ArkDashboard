import { MetaTags } from "@redwoodjs/web";
import Button from "src/components/Util/Button/Button";

const TermsPage = () => {
  return (
    <>
      <MetaTags title="Terms" description="Terms & conditions" />
      <div className="font-montserrat my-4 mx-auto max-w-lg space-y-3 p-4 text-gray-600 dark:text-white">
        <h1 className="border-b py-3 text-center text-3xl font-bold leading-7">
          Terms & Conditions
        </h1>
        <p className="text-sm font-normal leading-6">
          These terms and conditions outline the rules and regulations for the
          use of {window.location.hostname}'s website. By accessing this website
          or using our services, you accept and agree to be bound by these terms
          and conditions. If you do not agree with any part of these terms, you
          must not use our services or access this website.
        </p>
        <h3 className="text-xl font-bold">Intellectual Property</h3>
        <p className="text-sm font-normal leading-6">
          All materials, including text, images, graphics, logos, and other
          content available on this website, are the intellectual property of
          the us unless otherwise stated. Game content and materials are
          trademarks and copyrights of their respective publisher and its
          licensors.
        </p>
        <h3 className="text-xl font-bold">User Obligations</h3>
        <p className="text-sm font-normal leading-6">
          By using our services, you agree to: Provide accurate and up-to-date
          information when registering or using our services. Protect your
          account credentials and not share them with others. Use our services
          only for lawful purposes and in compliance with applicable laws and
          regulations. Refrain from engaging in any activities that may disrupt
          or interfere with the proper functioning of our services or website.
          Respect the rights of other users and the websites moderators and
          admins, and not engage in any actions that may infringe upon those
          rights.
        </p>
        <h3 className="text-xl font-bold">
          Modification of Terms and Conditions
        </h3>
        <p className="text-sm font-normal leading-6">
          The owner reserves the right to revise these terms and conditions at
          any time without prior notice. By continuing to use our services or
          access this website, you are agreeing to be bound by the current
          version of these terms and conditions.
        </p>

        <p>
          "I am done reading here"
          <Button
            variant="text"
            color="success"
            onClick={() => window.history.back()}
          >
            Take me back
          </Button>
        </p>
      </div>
    </>
  );
};

export default TermsPage;
