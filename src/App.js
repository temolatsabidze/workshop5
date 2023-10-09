import React, { useEffect, useState } from "react";
import axios from "axios";

const validate = (formValues) => {
  const errors = {};

  if (!formValues.name || formValues.name.length < 4) {
    errors.name = "Username should have at least 4 characters";
  }

  if (!formValues.lastName || formValues.lastName.length < 4) {
    errors.lastName = "Second Name should have at least 4 characters";
  }

  if (!formValues.email || !formValues.email.includes("gmail.com")) {
    errors.email = "Email should have @gmail.com";
  }

  if (!formValues.age || formValues.age < 18) {
    errors.age = "You should be at least 18 to register";
  }

  return errors;
};

const initialValues = { name: "", lastName: "", email: "", age: 0 };

function App() {
  const [users, setUsers] = useState([]);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/users")
      .then((resolve) => {
        setUsers(resolve.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const validationResult = validate(formValues);
    setFormErrors(validationResult);
    if (Object.keys(validationResult).length === 0) {
      if (formValues.id) {
        setUsers((prevUsers) => {
          return prevUsers.map((user) =>
            user.id === formValues.id ? { ...formValues } : user
          );
        });
      } else {
        setUsers((prevUsers) => [
          ...prevUsers,
          { ...formValues, id: new Date().toString() },
        ]);
      }
    }
    setFormValues(initialValues);
    console.log(formValues);
  };

  const onDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((item) => item.id !== id));
    useEffect(() => {
      axios
        .delete(`http://localhost:3001/users/${id}`)
        .then(() => {
          fetchUsers();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error", error);
          setLoading(false);
        });
    }, []);
    setLoading(true);
  };

  const onEdit = (id) => {
    const selectedUser = users.find((user) => user.id === id);
    setFormValues(selectedUser);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={onFormChange}
        />
        {formErrors.name && <p>{formErrors.name}</p>}
        <input
          type="text"
          name="lastName"
          value={formValues.lastName}
          onChange={onFormChange}
        />
        {formErrors.lastName && <p>{formErrors.lastName}</p>}
        <input
          type="text"
          name="email"
          value={formValues.email}
          onChange={onFormChange}
        />
        {formErrors.email && <p>{formErrors.email}</p>}
        <input
          type="number"
          name="age"
          value={formValues.age}
          onChange={onFormChange}
        />
        {formErrors.age && <p>{formErrors.age}</p>}
        <button>add user</button>
      </form>
      <h1>USERS:</h1>
      {users.map(({ id, name, lastName, email, age }) => {
        return (
          <div key={id}>
            <p>Name:{name}</p>
            <p>lastName:{lastName}</p>
            <p>email:{email}</p>
            <p>Age:{age}</p>
            <button onClick={() => onDelete(id)}>delete</button>
            <button onClick={() => onEdit(id)}>edit</button>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default App;
