import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0";
import { Dashboard } from "/lib/dashboard/src/Dashboard.js";
hydrateRoot(Dashboard, document.getElementById("app"));
