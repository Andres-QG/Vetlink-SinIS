import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ConsultView from '../components/Consult/ConsultView';
import { ThemeProvider, createTheme } from '@mui/material/styles';

jest.mock('axios');
jest.mock('../components/Notification', () => ({
  useNotification: jest.fn(() => jest.fn()),
}));

jest.mock('../components/Consult/GeneralTable', () => (props) => (
  <div data-testid="general-table">
    {props.data.map((item) => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
));
jest.mock('../components/Consult/GeneralizedSearchBar', () => (props) => (
  <input
    placeholder="SearchBar Component"
    onChange={(e) => props.onSearch(e.target.value, props.columns[0], 'asc')}
  />
));

describe('ConsultView Component', () => {
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
  ];

  const mockProps = {
    title: 'Test Title',
    fetchUrl: '/api/test-fetch',
    deletionUrl: '/api/test-delete',
    restoreUrl: '/api/test-restore',
    addComponent: () => <div data-testid="add-component">Add Component</div>,
    modifyComponent: () => <div data-testid="modify-component">Modify Component</div>,
    detailedInfoComponent: () => <div data-testid="detailed-info-component">Detailed Info Component</div>,
    columns,
    pkCol: 'id',
    visualIdentifierCol: 'name',
    rowsPerPage: 5,
    otherData: {},
    customDeleteTitle: 'Delete Test',
    disableAddButton: false,
    disableModifyAction: false,
    disableDeleteAction: false,
    disableReactivateAction: false,
    hideAddButton: false,
    hideActions: false,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        results: [
          { id: 1, name: 'John Doe', age: 30 },
          { id: 2, name: 'Jane Smith', age: 25 },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title and Add button', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  it('shows a loading spinner while data is being fetched', async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  });

  it('displays fetched data in GeneralTable', async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters data based on search term', async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('SearchBar Component');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('disables the Add button when disableAddButton is true', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} disableAddButton={true} />
      </ThemeProvider>
    );

    const addButton = screen.getByText('Agregar');
    expect(addButton).toBeDisabled();
  });

  it('hides the Add button when hideAddButton is true', () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} hideAddButton={true} />
      </ThemeProvider>
    );

    expect(screen.queryByText('Agregar')).not.toBeInTheDocument();
  });

  it('renders GeneralTable with correct props', async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    await waitFor(() => expect(screen.getByTestId('general-table')).toBeInTheDocument());
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('passes correct props to GeneralTable', async () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <ConsultView {...mockProps} />
      </ThemeProvider>
    );

    await waitFor(() => {
      const generalTable = screen.getByTestId('general-table');
      expect(generalTable).toBeInTheDocument();
    });
    
  });
});
