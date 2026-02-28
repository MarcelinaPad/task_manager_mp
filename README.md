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