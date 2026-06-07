# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Instead, email [josh@aelf.red](mailto:josh@aelf.red) with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact

I will acknowledge receipt within 72 hours and aim to respond with a plan within 7 days. If the issue is confirmed, I will release a patch as soon as possible depending on severity.

## Scope

Aelfred is a self-hosted personal AI platform. The attack surface that matters most:

- Authentication and session management (JWT / httpOnly cookies)
- Data isolation between the server and external services
- LLM prompt injection vectors
- File system access controls

## Out of scope

- Issues in your own deployment infrastructure
- Issues in third-party dependencies (report those upstream)
- Theoretical vulnerabilities without demonstrated impact
