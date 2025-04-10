const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Configuration de chai
chai.use(chaiHttp);

// Assurez-vous que nous utilisons une base de données de test séparée
const TEST_DB_PATH = './db/test-database.sqlite';

// Supprimer la base de données de test si elle existe déjà
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}

// Créer le dossier de la BD si nécessaire
if (!fs.existsSync('./db')) {
  fs.mkdirSync('./db');
}

// Initialisation du serveur pour les tests
let server;

describe('API Utilisateurs', () => {
  before((done) => {
    // Créer et initialiser la base de données de test
    const db = new sqlite3.Database(TEST_DB_PATH);
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )`);

      // Ajouter des données de test
      db.run('INSERT INTO users (name, email) VALUES (?, ?)', ['Test User', 'test@example.com'], () => {
        process.env.DB_PATH = TEST_DB_PATH;
        const appModule = require('../server');
        server = appModule.app;
        server.locals.db = appModule.db;
        done();
      });
    });
  });

  // Test GET /users
  describe('GET /users', () => {
    it('devrait récupérer tous les utilisateurs', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('users').that.is.an('array');
          done();
        });
    });

    it('devrait retourner une erreur 500 si la requête échoue', (done) => {
      const originalAll = server.locals.db.all;
      server.locals.db.all = (sql, callback) => {
        callback(new Error('Erreur simulée'), null);
      };

      chai.request(server)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          server.locals.db.all = originalAll;
          done();
        });
    });
  });

  // Test POST /users
  describe('POST /users', () => {
    it('devrait créer un nouvel utilisateur', (done) => {
      const newUser = { name: 'Nouveau User', email: 'nouveau@example.com' };

      chai.request(server)
        .post('/users')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          done();
        });
    });

    it('ne devrait pas créer un utilisateur avec un email existant', (done) => {
      const duplicateUser = { name: 'User Duplicate', email: 'test@example.com' };

      chai.request(server)
        .post('/users')
        .send(duplicateUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  // Test PUT /users/:id
  describe('PUT /users/:id', () => {
    it('devrait mettre à jour un utilisateur existant', (done) => {
      const updatedInfo = { name: 'Updated Name', email: 'updated@example.com' };

      chai.request(server)
        .get('/users')
        .end((err, res) => {
          const userId = res.body.users[0].id;

          chai.request(server)
            .put(`/users/${userId}`)
            .send(updatedInfo)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('changes');
              done();
            });
        });
    });

    it('devrait retourner une erreur si la mise à jour échoue', (done) => {
      const originalRun = server.locals.db.run;
      server.locals.db.run = (sql, params, callback) => {
        callback(new Error('Erreur de mise à jour'));
      };

      chai.request(server)
        .put('/users/1')
        .send({ name: 'Fail', email: 'fail@example.com' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          server.locals.db.run = originalRun;
          done();
        });
    });
  });

  // Test DELETE /users/:id
  describe('DELETE /users/:id', () => {
    it('devrait supprimer un utilisateur existant', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          const userId = res.body.users[0].id;

          chai.request(server)
            .delete(`/users/${userId}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('changes');
              done();
            });
        });
    });

    it('devrait retourner une erreur si la suppression échoue', (done) => {
      const originalRun = server.locals.db.run;
      server.locals.db.run = (sql, param, callback) => {
        callback(new Error('Erreur de suppression'));
      };

      chai.request(server)
        .delete('/users/999')
        .end((err, res) => {
          expect(res).to.have.status(400);
          server.locals.db.run = originalRun;
          done();
        });
    });
  });
});
