# ActSpec

**ActSpec** is an open cryptographic standard for proving that an automated or AI-driven action was explicitly authorized by a responsible entity.

It defines a portable, independently verifiable **proof of authorization**, called an **ActProof**.

ActSpec is designed for compliance, auditability, accountability, and governance of automated systems.

---

## What ActSpec Is

ActSpec defines:
- a **proof format** (ActProof),
- a **verification model** (offline-first),
- a **cryptographic binding** between authorization intent and time.

An ActProof is a **cryptographic receipt**.

It proves that an authorization existed.  
It does **not** execute, enforce, or validate the action itself.

---

## What ActSpec Is Not

ActSpec is **not**:
- an execution engine,
- an IAM / SSO / RBAC system,
- a policy engine,
- a workflow orchestrator,
- a logging system,
- a blockchain.

ActSpec never runs code, blocks actions, or decides outcomes.

---

## Core Principle

**Authorization is not execution.**

ActSpec records *intent*, not *effects*.

---

## High-Level Model (Blind Notary)

1. The client defines an **Authorization Manifest** locally.
2. The manifest is canonicalized (RFC 8785).
3. The canonical form is hashed (SHA-256).
4. Only the hash is sent to an issuer.
5. The issuer timestamps and signs a receipt.
6. The resulting **ActProof** can be verified offline.

At no point does the issuer receive:
- prompts,
- parameters,
- secrets,
- PII,
- business logic.

---

## Trust Boundary

**Client responsibilities**
- Define authorization intent.
- Protect sensitive data.
- Store the Authorization Manifest.
- Map the manifest hash to the real-world action.

**Issuer responsibilities**
- Timestamp integrity.
- Signature correctness.
- Public key governance.

ActSpec acts as a **blind cryptographic notary**.

---

## Repository Contents

This repository contains the **ActSpec v0.1 standard**, and nothing else.

- `SPEC.md` — Normative technical specification.
- `GOVERNANCE.md` — Key management and revocation policy.
- `CHANGELOG.md` — Specification history.
- `LICENSE` — Open standard license.

There is **no code** in this repository by design.

---

## Status

- **Version:** v0.1
- **Status:** Public Draft
- **Verification model:** Offline-first
- **Cryptography:** Ed25519 + SHA-256 + RFC 8785 (JCS)

---

## Compliance Alignment

ActSpec is designed to support:
- EU AI Act (Human Oversight & Record-Keeping),
- ISO/IEC 42001 (AI governance),
- GDPR accountability principle,
- audit, insurance, and liability workflows.

---

## Canonical Statement

> ActSpec is a cryptographic standard for producing a receipt proving that an automated action was explicitly authorized, at a specific time, in a defined context.

---

## Final Note

ActSpec does not replace existing systems.

It provides the missing proof layer between **authorization** and **execution**.

**Authorization without proof is liability.**
