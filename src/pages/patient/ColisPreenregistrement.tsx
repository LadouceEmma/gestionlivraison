import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Table,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "./composants/sidebar";

interface Agence {
  id: number;
  nom: string;
}

interface Colis {
  id: number;
  code_suivi: string;
  agence_depart: string;
  agence_arrivee: string;
  statut: string;
}

const ColisPreenregistrement: React.FC = () => {
  const [agences, setAgences] = useState<Agence[]>([]);
  const [colisList, setColisList] = useState<Colis[]>([]);
  const [formData, setFormData] = useState({
    agence_depart: "",
    agence_arrivee: "",
    poids: "",
    valeur: "",
    contenu: "",
    destinataire_nom: "",
    destinataire_telephone: "",
    destinataire_adresse: "",
    livraison: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await api.get("/agences");
        setAgences(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des agences:", err);
      }
    };
    fetchAgences();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await api.post(
        "/create-colis/client",
        formData,
        config
      );
      setSuccess(
        `Colis enregistré avec succès ! Code de suivi : ${response.data.code_suivi}`
      );

      setColisList((prev) => [
        ...prev,
        {
          id: response.data.colis_id,
          code_suivi: response.data.code_suivi,
          agence_depart:
            agences.find((a) => a.id === parseInt(formData.agence_depart))
              ?.nom || "",
          agence_arrivee:
            agences.find((a) => a.id === parseInt(formData.agence_arrivee))
              ?.nom || "",
          statut: "En attente",
        },
      ]);

      setFormData({
        agence_depart: "",
        agence_arrivee: "",
        poids: "",
        valeur: "",
        contenu: "",
        destinataire_nom: "",
        destinataire_telephone: "",
        destinataire_adresse: "",
        livraison: false,
      });
    } catch (err: any) {
      console.error("Erreur:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          "Une erreur est survenue lors de l'enregistrement du colis."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <div className="d-flex flex-grow-2">
        <Sidebar />
        <main className="flex-grow-1 p-3 p-md-4">
          <h3 className="text-orange mb-4 fw-bold">
            Pré-enregistrement d’un colis
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Agence de départ
                      </Form.Label>
                      <Form.Select
                        name="agence_depart"
                        value={formData.agence_depart}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez une agence</option>
                        {agences.map((agence) => (
                          <option key={agence.id} value={agence.id}>
                            {agence.nom}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Agence d’arrivée
                      </Form.Label>
                      <Form.Select
                        name="agence_arrivee"
                        value={formData.agence_arrivee}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionnez une agence</option>
                        {agences.map((agence) => (
                          <option key={agence.id} value={agence.id}>
                            {agence.nom}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Poids (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        name="poids"
                        value={formData.poids}
                        onChange={handleChange}
                        placeholder="Ex: 5"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Valeur estimée (FCFA)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="valeur"
                        value={formData.valeur}
                        onChange={handleChange}
                        placeholder="Ex: 10000"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Contenu</Form.Label>
                      <Form.Control
                        type="text"
                        name="contenu"
                        value={formData.contenu}
                        onChange={handleChange}
                        placeholder="Ex: vêtements, électronique..."
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="text-orange fw-bold mt-4">
                  Informations du destinataire
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Nom du destinataire
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="destinataire_nom"
                        value={formData.destinataire_nom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Téléphone du destinataire
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="destinataire_telephone"
                        value={formData.destinataire_telephone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Livraison à domicile"
                    name="livraison"
                    checked={formData.livraison}
                    onChange={handleChange}
                  />
                </Form.Group>

                {formData.livraison && (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Adresse du destinataire
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="destinataire_adresse"
                      value={formData.destinataire_adresse}
                      onChange={handleChange}
                      placeholder="Ex: Rue XXXX, Ville"
                      required={formData.livraison}
                    />
                  </Form.Group>
                )}

                <div className="d-grid">
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={loading}
                    className="text-white fw-bold"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Enregistrement...
                      </>
                    ) : (
                      "Enregistrer le colis"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* ======= TABLEAU DES COLIS ======= */}
          {colisList.length > 0 && (
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-orange fw-bold mb-3">
                  Colis enregistrés
                </h5>
                <Table responsive striped hover>
                  <thead className="table-warning text-white">
                    <tr>
                      <th>#</th>
                      <th>Code de suivi</th>
                      <th>Agence départ</th>
                      <th>Agence arrivée</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colisList.map((colis, index) => (
                      <tr key={colis.id}>
                        <td>{index + 1}</td>
                        <td>{colis.code_suivi}</td>
                        <td>{colis.agence_depart}</td>
                        <td>{colis.agence_arrivee}</td>
                        <td>{colis.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default ColisPreenregistrement;
