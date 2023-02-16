import React from "https://esm.sh/react@18.2.0";
import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0";
import { Dashboard } from "/lib/dashboard/src/Dashboard.js";
hydrateRoot(document.getElementById("app"), /*#__PURE__*/ React.createElement(Dashboard, null));
