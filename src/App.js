import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import "./App.css";

function App() {
  // State variables
  const [showNoContacts, setShowNoContacts] = useState(false); // Flag to show "No contacts found" message
  const [contacts, setContacts] = useState([]); // Array to store all contacts
  const [searchTerm, setSearchTerm] = useState(""); // Search term entered by the user
  const [filteredContacts, setFilteredContacts] = useState([]); // Filtered contacts based on the search term
  const [noContactsFound, setNoContactsFound] = useState(false); // Flag to indicate if no contacts are found
  const [contactNames, setContactNames] = useState([]); // Array to store contact names for filtering
  const [searchButtonClicked, setSearchButtonClicked] = useState(false); // Flag to indicate if search button is clicked

  useEffect(() => {
    // Fetch contacts data when component mounts
    fetchContacts();
  }, []);

  // Fetch contacts data from the API
  const fetchContacts = () => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        const names = data.map((contact) => contact.name);
        setContactNames(names);
      })
      .catch((error) => {
        console.log("An error occurred while fetching contacts:", error);
      });
  };

  // Handle form submission for searching contacts
  const searchContacts = (e) => {
    e.preventDefault();
    const exactContacts = contacts.filter(
      (contact) => contact.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setFilteredContacts(exactContacts);
    setShowNoContacts(exactContacts.length === 0 && searchTerm !== "");
    setSearchTerm("");
    setSearchButtonClicked(true);
  };

  // Handle input change for filtering contact names
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredNames = contactNames.filter((name) =>
      name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFilteredContacts(filteredNames);
  };

  // Handle click on a contact name to set it in the search input
  const handleContactClick = (name) => {
    setSearchTerm(name);
    setFilteredContacts([]);
  };

  // Show the main page and reset the search inputs and results
  const showMainPage = () => {
    setSearchTerm("");
    setFilteredContacts([]);
    setSearchButtonClicked(false);
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Contacts</h1>

      <div className="main-page">
        <Form onSubmit={searchContacts} className="text-center">
          <Form.Group controlId="search-input">
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Enter the full name"
              className="search-input"
              autoComplete="off"
              list="contact-names"
            />
            {/* Render datalist only when search term is entered */}
            {searchTerm && (
              <datalist id="contact-names">
                {filteredContacts.map((name) => (
                  // Handle click on a contact name from the list
                  <option
                    key={name}
                    value={name}
                    onClick={() => handleContactClick(name)}
                  />
                ))}
              </datalist>
            )}
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form.Group>
        </Form>
      </div>

      {/* Show "No contacts found" message when applicable */}
      {searchButtonClicked && showNoContacts && (
        <div className="text-center mt-4 no-contacts">
          <p>No contacts found.</p>
          <Button variant="primary" onClick={showMainPage}>
            Go Back
          </Button>
        </div>
      )}

      {/* Show filtered contacts when search button is clicked */}
      {searchButtonClicked && filteredContacts.length > 0 && (
        <div className="contact-details-page">
          <h2 className="text-center mt-4">Contact Details</h2>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-center">
            <Button variant="primary" onClick={showMainPage}>
              Go Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
