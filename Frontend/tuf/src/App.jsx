import { BrowserRouter, Route, Routes } from "react-router-dom";
import SnippetList from "./SnippetList.jsx";
import SubmitForm from "./SubmitForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmitForm />} />
        <Route path="/page2" element={<SnippetList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
