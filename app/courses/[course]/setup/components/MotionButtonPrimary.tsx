import { motion } from "framer-motion";

// Importing the `ButtonPrimary` component from the
// `@/components/button-primary` folder instead of `@/components`
// is necessary to avoid runtime errors.
//
// The error is caused because the index file also contains the `Navbar`
// component which uses server-side functions that are not available on
// the client-side.
//
// Not sure if this is the best solution, but it works for now.
//
// Having better separation of concerns might be more desirable.
import { ButtonPrimary } from "@/components/button-primary";
import { ButtonPrimaryProps } from "@/components/button-primary/types";

const MotionButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <ButtonPrimary {...props}>{children}</ButtonPrimary>
  </motion.div>
);

export { MotionButtonPrimary };
