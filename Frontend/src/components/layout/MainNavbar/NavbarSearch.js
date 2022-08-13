import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormInput,
  Button
} from "shards-react";
import store from "../../../flux/store";

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [redirectToSearch, setRedirectToSearch] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (redirectToSearch) {
      setRedirectToSearch(false);
      history.push({ pathname: "/search", search: '?query=' + searchQuery })
    }
  }, [redirectToSearch]);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      store.setCurrentSearchQuery(searchQuery);
      setRedirectToSearch(true);
    }
  }

  return (
    <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex" onSubmit={handleSubmit}>
      <InputGroup seamless className="ml-3">
        <InputGroupAddon type="prepend">
          <InputGroupText>
            <i className="material-icons">search</i>
          </InputGroupText>
        </InputGroupAddon>
        <FormInput
          id="searchKeyword"
          name="searchKeyword"
          className="navbar-search"
          placeholder="Search for something..."
          onChange={handleChange}
        />
        <InputGroupAddon type="append">
          <Button theme="white" type="submit" onSubmit={handleSubmit} onClick={handleSubmit}><i className="material-icons">search</i></Button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  )
};

export default SearchForm;
