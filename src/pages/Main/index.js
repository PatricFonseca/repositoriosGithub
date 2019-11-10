import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';
import api from '../../Services/api';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    errorInput: false,
  };

  //Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  //Salvando os dados no localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({
      loading: true,
      errorInput: false,
    });

    try {
      const { newRepo, repositories } = this.state;

      const existRepo = repositories.find(rep => {
        return rep.name === newRepo;
      });
      //   console.log('Repositório duplicado');
      //   throw new Error('Repositório duplicado');
      // }
      if (existRepo) {
        console.log('Repositório duplicado');
        throw new Error('Repositório duplicado');
      }

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });

      console.log(response.data);
    } catch {
      this.setState({
        errorInput: true,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { newRepo, loading, repositories, errorInput } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} errorInput={errorInput}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="FFF" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              {/* <a href="#0">Detalhes</a> */}
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
