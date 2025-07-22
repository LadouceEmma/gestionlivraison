import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  
  Spinner,
  Alert,
  Button
} from "react-bootstrap";
import { Package, Clock, CheckCircle, Archive } from "lucide-react";
import api from "../../services/api";

import QrScannerModal from "./composants/QrScannerModal";
import { useNavigate } from "react-router-dom";
import PackageList from "./composants/listeInterface";
import Sidebar from "./composants/sidebar";

const ClientDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    colis_envoyes_du_jour: 0,
    colis_livres_du_jour: 0,
    colis_total: 0,
    colis_en_attente: 0,
    colis_livres: 0,
    colis_enregistres: 0,
  });
  const [packages, setPackages] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, packagesRes] = await Promise.all([
          api.get("/client/dashboard-stats"),
          api.get("/client/colis"),
        ]);
        setStats(statsRes.data);
        setPackages(packagesRes.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="warning" />
      </div>
    );

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column bg-light">
      <div className="d-flex flex-grow-2">
        <Sidebar />
        <main className="flex-grow-1 p-3 p-md-4">
          <h3 className="mb-4 fw-bold text-warning">
            Tableau de bord client
          </h3>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* ==== Statistiques ==== */}
          <Row className="mb-4 g-4">
            <Col md={4}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-25 p-3 rounded me-3">
                    <Package className="text-warning" size={28} />
                  </div>
                  <div>
                    <Card.Title>Total Colis</Card.Title>
                    <h4 className="fw-bold">{stats.colis_total}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-secondary bg-opacity-25 p-3 rounded me-3">
                    <Clock className="text-secondary" size={28} />
                  </div>
                  <div>
                    <Card.Title>En attente</Card.Title>
                    <h4 className="fw-bold">{stats.colis_en_attente}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-25 p-3 rounded me-3">
                    <CheckCircle className="text-success" size={28} />
                  </div>
                  <div>
                    <Card.Title>Livrés</Card.Title>
                    <h4 className="fw-bold">{stats.colis_livres}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-25 p-3 rounded me-3">
                    <Archive className="text-info" size={28} />
                  </div>
                  <div>
                    <Card.Title>Enregistrés</Card.Title>
                    <h4 className="fw-bold">{stats.colis_enregistres}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-25 p-3 rounded me-3">
                    <Package className="text-warning" size={28} />
                  </div>
                  <div>
                    <Card.Title>Envoyés aujourd'hui</Card.Title>
                    <h4 className="fw-bold">
                      {stats.colis_envoyes_du_jour}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow border-0">
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-25 p-3 rounded me-3">
                    <CheckCircle className="text-success" size={28} />
                  </div>
                  <div>
                    <Card.Title>Livrés aujourd'hui</Card.Title>
                    <h4 className="fw-bold">
                      {stats.colis_livres_du_jour}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ==== Derniers colis ==== */}
          <PackageList
            title="Derniers colis"
            packages={packages.slice(0, 5)}
            onTrack={(pkg) => navigate(`/client/tracking/${pkg.code_suivi}`)}
            onScan={() => setShowScanner(true)}
          />

          <div className="mt-3">
            <Button
              variant="warning"
              onClick={() => navigate("/ClientHistory")}
            >
              Voir l'historique complet
            </Button>
          </div>

          <QrScannerModal
            show={showScanner}
            onClose={() => setShowScanner(false)}
          />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
