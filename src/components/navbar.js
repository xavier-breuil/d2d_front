import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {

const linkFormat = {color: 'white', fontSize: '1.3em'};

  return (
    <Navbar expand="lg" sticky="top" bg="primary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/" style={linkFormat}>semainier</Nav.Link>
          <Nav.Link href="/task" style={linkFormat}>ajouter une tâche</Nav.Link>
          <Nav.Link href="/mot" style={linkFormat}>tâches récurrentes</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;