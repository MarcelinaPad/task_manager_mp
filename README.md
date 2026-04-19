# Task Manager w chmurze (cloud-app)

Autor: Marcelina Paduszyńska, nr albumu: 98765

## Opis projektu

Aplikacja webowa do zarządzania zadaniami użytkownika w chmurze. Użytkownik może założyć konto i zalogować się, a następnie tworzyć, edytować, usuwać oraz przeglądać listę i szczegóły zadań. Zadania posiadają priorytety (np. niski/średni/wysoki), a komunikacja między front-endem i back-endem odbywa się przez REST API.

## Stos technologiczny

- Front-end: React 19 + Vite
- Back-end: .NET 9 (ASP.NET Core Web API)
- Baza danych: Azure SQL Database
- Komunikacja: REST/JSON (HTTPS)
- Uruchomienie lokalne: Docker + docker-compose
- Konfiguracja: zmienne środowiskowe (.env / App Service Settings)

## Mapowanie na usługi Azure (deklaracja architektoniczna)

| Warstwa / komponent | Technologia | Azure usługa | Protokół / port |
|---|---|---|---|
| Prezentacja (Frontend SPA) | React 19 + Vite | Azure Static Web Apps (lub App Service) | HTTPS 443 |
| Aplikacja (Backend API) | .NET 9 Web API | Azure App Service | HTTPS 443 |
| Dane (Database) | Azure SQL | Azure SQL Database | TDS/SQL TCP 1433 |

## Status Projektu

- [x] **Artefakt 1:** Architektura i struktura folderów.
- [x] **Artefakt 2:** Środowisko wielokontenerowe uruchomione lokalnie (Docker Compose).
- [x] **Artefakt 3:** Działająca warstwa prezentacji (React + Vite) + komunikacja z API (Axios GET).
- [x] **Artefakt 4:** Działająca warstwa logiki backendu (.NET + Swagger CRUD + SQL Connection).
- [x] **Artefakt 5: DTO, migracje, trwałość danych i dodawanie zadań w React

## Co działa lokalnie (Docker Compose)

- Frontend uruchamia się pod: http://localhost:5173
- Backend API działa pod: http://localhost:8080
- Baza danych (SQL Server – lokalny odpowiednik Azure SQL) działa na porcie: 1433
- Komunikacja: Frontend → Backend przez REST/JSON

## Deployment Azure

Aplikacja została wdrożona w Microsoft Azure.

### Backend (.NET API)
Backend działa w Azure App Service:
https://cloud-task-manager-api-marcelina-b0d8fhbegsb9hmh8.germanywestcentral-01.azurewebsites.net/swagger

### Frontend (React)
Frontend działa w Azure App Service:
https://cloud-task-manager-frontend-marcelina-chddf2a4dhajhgb8.germanywestcentral-01.azurewebsites.net

### Baza danych
Baza danych została utworzona w Azure SQL Database. Schemat bazy został zmigrowany przy użyciu Entity Framework Core komendą:

dotnet ef database update

### Ulepszenia bezpieczeństwa
- Dane dostępowe do bazy danych zostały usunięte z kodu źródłowego
- Skonfigurowano Azure Key Vault
- Włączono Managed Identity dla App Service
- Backend odczytuje sekret `DbConnectionString` z Azure Key Vault

## Artefakt 8 – testy i automatyzacja CI/CD

### 8.1 Test jednostkowy xUnit
W projekcie dodano osobny projekt testowy xUnit: `TaskManager.Api.Tests`.

Zaimplementowano test jednostkowy `NewTask_ShouldNotBeCompleted`, który:
- tworzy nowy obiekt modelu zadania (`TaskEntity`),
- ustawia tytuł zadania,
- sprawdza, czy właściwość `IsDone` ma wartość `false`.

Test potwierdza, że nowe zadanie nie jest domyślnie oznaczane jako wykonane.

### 8.2 Automatyzacja wdrażania
Skonfigurowano połączenie GitHub z Azure App Service przez Centrum wdrażania (Deployment Center).

Dla backendu i frontendu wygenerowano workflow GitHub Actions, które uruchamiają się po zmianach w gałęzi `main`.

### 8.3 Test pchnięcia (Push Test)
W celu sprawdzenia automatycznego wdrażania wykonano zmianę wizualną i funkcjonalną we frontendzie:
- zmieniono nagłówek na `Cloud App Dashboard CI/CD`,
- zmieniono kolor nagłówka,
- ustawiono domyślny priorytet nowego zadania na `High`.

Po wykonaniu `git push` workflow GitHub Actions uruchomił się automatycznie i wdrożył nową wersję aplikacji.

### 8.4 Nowa funkcja – usuwanie zadania
Dodano funkcję usuwania zadania:
- w backendzie zaimplementowano metodę HTTP `DELETE`,
- we frontendzie dodano przycisk z ikoną kosza,
- po kliknięciu zadanie znika z listy.

### Adresy aplikacji
**Backend (Swagger):**  
https://cloud-task-manager-api-marcelina-b0d8fhbegsb9hmh8.germanywestcentral-01.azurewebsites.net/swagger

**Test bazy danych:**  
https://cloud-task-manager-api-marcelina-b0d8fhbegsb9hmh8.germanywestcentral-01.azurewebsites.net/api/db-test

**Frontend:**  
https://cloud-task-manager-frontend-marcelina-chddf2a4dhajhgb8.germanywestcentral-01.azurewebsites.net/
