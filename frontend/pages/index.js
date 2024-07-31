import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For registration
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegistering) {
      // Registration logic
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Store user credentials in local storage
      localStorage.setItem("user", JSON.stringify({ email, password }));

      // Clear fields and switch to login mode
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsRegistering(false);
      setError("");
    } else {
      // Login logic
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      // Verify credentials
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        // On successful login
        router.push("/home");
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h3>

          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
            {isRegistering ? "Register to create an account" : "Login to your account"}
          </p>

          {error && (
            <p className="text-red-500 text-center mt-2">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 text-white placeholder-gray-500 bg-gray-800 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full mt-4">
              <input
                className="block w-full px-4 py-2 mt-2 text-white placeholder-gray-500 bg-gray-800 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-white placeholder-gray-500 bg-gray-800 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
              >
                Forget Password?
              </a>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                {isRegistering ? "Register" : "Sign In"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            {isRegistering ? "Already have an account?" : "Don't have an account? "}
          </span>

          <a
            href="#"
            className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </a>
        </div>
      </div>
    </div>
  );
}
