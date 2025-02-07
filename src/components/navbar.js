import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function NavBar() {

const linkFormat = {color: 'white', fontSize: '1.3em'};

const logOut = () => {
  localStorage.removeItem('djangoUser');
  window.location.reload(false);
}

  return (
    <Navbar expand="lg" sticky="top" bg="primary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/" style={linkFormat}>semainier</Nav.Link>
          <Nav.Link href="/task" style={linkFormat}>ajouter une tâche</Nav.Link>
          <Nav.Link href="/mot" style={linkFormat}>tâches récurrentes</Nav.Link>
          <Nav.Link href="/label" style={linkFormat}>étiquettes</Nav.Link>
          <Nav.Link href="/synchronisation" style={linkFormat}>synchronisation</Nav.Link>
          </Nav>
          <Button onClick={logOut}>Quitter</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;