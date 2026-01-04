# ActProofs Key Management & Governance Policy

**Version:** 1.0
**Effective Date:** 2026-01-04
**Maintainer:** ActProofs Foundation Security Committee

---

## 1. Root Key Lifecycle

* **Algorithm:** Ed25519 (Edwards-curve Digital Signature Algorithm).
* **Validity Period:** Root keys are valid for **12 months** from issuance.
* **Rotation Schedule:** A new key is generated 30 days before the expiration of the current key (Overlap Period) to ensure seamless service transition.

---

## 2. Generation & Protection

1.  **Generation Environment:**
    * New keys are generated within a secure, access-controlled environment.
    * **Hardware-backed key storage (HSM / Cloud KMS) is RECOMMENDED** for production environments to prevent key extraction.
    * For development or early-stage tenants, secure secret management systems (e.g., Vault, Encrypted Env Vars) are acceptable provided access is strictly audited.

2.  **Publication:**
    * The Public Key is published to the `.well-known/jwks.json` endpoint (or equivalent distribution mechanism).
    * The Private Key never leaves the signing enclave.

3.  **Archival:**
    * Upon rotation, the old Private Key is destroyed securely.
    * The old Public Key remains online indefinitely to allow verification of historical proofs.

---

## 3. Compromise & Revocation

In the event of a suspected key compromise or security breach:

1.  **Immediate Revocation:** The compromised key ID is added to the **Issuer Revocation List (IRL)**.
2.  **Emergency Rotation:** A new key pair is generated and deployed immediately.
3.  **Transparency:** A public incident report is published within 4 hours of confirmation.
4.  **Impact Status:**
    * All proofs signed by the compromised key during the exposure window are marked as **"Untrusted"**.
    * **Crucial Distinction:** Such proofs remain *cryptographically valid* (the mathematical signature is correct) but are flagged as *operationally untrusted* (the origin cannot be guaranteed).

---

## 4. Verification History

ActProofs guarantees **Long-Term Verifiability**.

A proof issued in the past remains valid today, provided that:
1.  The Public Key used was valid *at the timestamp of issuance*.
2.  The key was not on the Issuer Revocation List (IRL) *at the time of issuance*.

---

## 5. Out of Scope

This policy strictly limits the responsibility of the ActProofs Foundation. The following are explicitly **OUT OF SCOPE**:

* **Identity Verification:** We authenticate the API Key (Tenant), not the individual human actor behind it.
* **Authorization Correctness:** We do not verify if the action was "right", "safe", or "compliant" with internal company policy. We only certify that the hash was signed.
* **Legal Validity:** The ActProof is technical evidence; its legal weight depends on the jurisdiction and context.
* **Client-Side Security:** The generation, storage, and protection of the Manifest file before and after signing are solely the client's responsibility.
