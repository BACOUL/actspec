# ActSpec v0.1 — Proof of Authorization Standard

**Status:** Public Draft  
**Version:** v0.1  
**Maintainer:** ActProofs Foundation  
**License:** Apache-2.0  

---

## 1. Abstract

ActSpec defines an open cryptographic standard for issuing and verifying proofs that an automated or AI-driven action was explicitly authorized by a responsible entity at a specific time and in a defined context.

An **ActProof** is a cryptographic receipt. It records authorization intent, not execution.

---

## 2. Motivation

### 2.1. What This Standard Solves

Modern systems rely on automation, AI agents, and CI/CD pipelines that can trigger actions with real-world impact. While execution logs exist, they do not prove intent, approval, or responsibility.

ActSpec fills this gap by providing portable, independently verifiable evidence that an authorization decision occurred.

### 2.2. Scope

**What ActSpec Is:**
- A cryptographic receipt format
- A stateless verification protocol
- A governance and compliance building block
- An offline-verifiable proof mechanism

**What ActSpec Is Not:**
- Not an execution engine
- Not an IAM, SSO, or RBAC system
- Not a policy engine
- Not a workflow orchestrator
- Not a logging system
- Not a blockchain

**ActSpec never executes, blocks, or permits actions.**

### 2.3. Core Principle

> **Authorization is not execution.**

ActSpec certifies that an authorization existed. It does not assert whether the action was correct, safe, or executed.

---

## 3. High-Level Protocol Flow (Blind Notary Model)

1. **Local Definition:**  
   The client defines an **Authorization Manifest** locally.

2. **Local Canonicalization:**  
   The client canonicalizes the manifest using RFC 8785 (JCS).

3. **Local Hashing:**  
   The client hashes the canonicalized manifest using SHA-256.

4. **Blind Request:**  
   The client sends **only the hash** to the ActProofs Issuer.

5. **Issuance:**  
   The Issuer timestamps, canonicalizes the receipt payload, and signs it.

6. **Verification:**  
   The returned **ActProof** is stored by the client and can be verified offline.

**Security Note:**  
At no point does the Issuer receive sensitive data, parameters, prompts, or PII.

---

## 4. Data Structures

### 4.1. Authorization Manifest (Client-Side)

The Authorization Manifest is client-owned and never transmitted in clear. It is cryptographically bound to the real action via hashing.

It defines:
- **Who** authorizes (actor)
- **What** action is authorized
- **In which** context
- **Under which** constraints

The structure of the manifest is intentionally flexible and implementation-specific.

### 4.2. ActProof Receipt (Signed Object)

The Issuer returns a signed **ActProof** containing:

- `spec` — Specification version (`actspec-v0.1`)
- `id` — Unique proof identifier (UUID)
- `issued_at` — ISO 8601 timestamp
- `manifest_hash` — SHA-256 hash provided by the client
- `issuer` — Issuer identifier
- `signature` — Cryptographic signature

The ActProof is a portable file that can be stored, shared, audited, and verified independently.

---

## 5. Cryptographic Design

- **Signature Algorithm:** Ed25519  
- **Hash Algorithm:** SHA-256  
- **Canonicalization:** RFC 8785 (JSON Canonicalization Scheme)

### 5.1. Signature Coverage (Normative)

The signature MUST cover the canonicalized payload containing:

- `spec`
- `id`
- `issued_at`
- `manifest_hash`
- `issuer`

**Security Requirement:**  
Signing only the `manifest_hash` is insufficient and insecure. Metadata integrity is mandatory.

---

## 6. Verification Rules (Normative)

A verifier MUST perform the following steps. Failure at any step invalidates the proof.

1. Enforce the specification version (`actspec-v0.1`).
2. Validate structural integrity (presence of required fields).
3. Separate payload from signature.
4. Canonicalize the payload using **RFC 8785**.
5. Verify the Ed25519 signature using the Issuer’s public key.
6. (Optional) Check revocation status via the Issuer’s API.

### 6.1. Stateless Verification

ActSpec supports full offline verification.  
Only the ActProof file and the Issuer public key are required.

---

## 7. Revocation Model

- **Cryptographic Validity:** Immutable — the signature remains mathematically valid.
- **Operational Trust:** Mutable — proofs may be administratively revoked.

A revoked proof remains cryptographically valid but is flagged as **operationally untrusted**.

---

## 8. Trust Boundary

### 8.1. Client Responsibilities

- Define authorization intent
- Protect sensitive data
- Store the Authorization Manifest
- Map the signed `manifest_hash` to the real-world action

### 8.2. Issuer Responsibilities

- Timestamp integrity
- Signature correctness
- Tenant authentication (API key)
- Public key governance

**ActProofs acts as a blind notary.**

---

## 9. Compliance Alignment

ActSpec is designed to support:

- **EU AI Act:** Human oversight and record-keeping (Art. 14)
- **ISO/IEC 42001:** AI risk management
- **GDPR:** Accountability principle
- Audit, assurance, and governance workflows

---

## 10. Testing and Conformance (Normative)

To be considered **ActSpec v0.1 Compliant**, an implementation MUST:

1. Pass all official test vectors defined in `fixtures/actspec-v0.1.test-vectors.json`
2. Return correct results for both positive and negative cases
3. Reconstruct canonical payloads locally using RFC 8785

Failure to meet these requirements indicates a non-compliant implementation.

---

## 11. Canonical Statement

> *“ActProofs is a cryptographic receipt proving that an automated action was explicitly authorized by a responsible entity, at a specific time, in a defined context.”*

---

## 12. Final Note

ActSpec does not replace existing systems.  
It provides the missing proof layer between authorization and execution.

**Authorization without proof is liability.**
