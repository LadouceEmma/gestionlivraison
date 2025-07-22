import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

interface Props {
  filters: { days: number; status: string };
  onChange: (f: { days: number; status: string }) => void;
}

const Filters: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <Row className="mb-4">
      <Col md={4}>
        <Form.Group>
          <Form.Label>Période</Form.Label>
          <Form.Select
            value={filters.days}
            onChange={(e) => onChange({ ...filters, days: Number(e.target.value) })}
            style={{ borderColor: '#fd7e14' }}
          >
            <option value={7}>7 derniers jours</option>
            <option value={30}>30 derniers jours</option>
            <option value={90}>3 derniers mois</option>
            <option value={365}>1 an</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group>
          <Form.Label>Statut</Form.Label>
          <Form.Select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            style={{ borderColor: '#fd7e14' }}
          >
            <option value="">Tous les statuts</option>
            <option value="Enregistré">Enregistré</option>
            <option value="En transit">En transit</option>
            <option value="En livraison">En livraison</option>
            <option value="Livré">Livré</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={4} className="d-flex align-items-end">
        <Button 
          variant="warning" 
          className="w-100"
          style={{ backgroundColor: '#fd7e14', borderColor: '#fd7e14' }}
          onClick={() => console.log('Apply filters')}
        >
          Appliquer
        </Button>
      </Col>
    </Row>
  );
};

export default Filters;
