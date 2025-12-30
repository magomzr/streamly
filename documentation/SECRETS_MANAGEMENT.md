# Secrets Management

Streamly provides a secure way to store and use sensitive information (passwords, API keys, tokens) in your flows without exposing them in the flow configuration.

## Overview

Secrets are encrypted values stored in the database that can be referenced in your flow steps using a special syntax: `{{secret.SECRET_NAME}}`

### Key Features

- **AES-256-GCM Encryption**: All secrets are encrypted at rest in the database
- **Never Exposed**: Secret values are never shown in the UI or logs
- **Automatic Resolution**: Secrets are resolved at execution time
- **Easy Reference**: Copy secret references with one click
- **Reusable**: Use the same secret across multiple flows

## Setup

### 1. Generate Encryption Key

Before using secrets, you need to set an encryption key in your API environment:

```bash
# Generate a 32-byte (256-bit) key
openssl rand -hex 32
```

### 2. Configure Environment Variable

Add the generated key to your `api/.env` file:

```env
ENCRYPTION_KEY="your_64_character_hex_key_here"
```

**Important**: Never commit this key to version control. Keep it secure!

## Using Secrets

### Creating a Secret

1. Open the **Options** panel (top-left of the canvas)
2. Click **Manage Secrets**
3. Click **+ New Secret**
4. Enter:
   - **Name**: Uppercase with underscores only (e.g., `GMAIL_APP_PASSWORD`)
   - **Value**: The actual secret value (will be hidden)
5. Click **Create**

### Using Secrets in Flows

Once created, you can reference secrets in any step configuration field:

**Example: Send Email Step**

Instead of:

```json
{
  "appPassword": "abcd efgh ijkl mnop"
}
```

Use:

```json
{
  "appPassword": "{{secret.GMAIL_APP_PASSWORD}}"
}
```

### Copying Secret References

1. Open **Manage Secrets**
2. Find your secret
3. Click **Copy** button
4. Paste in any step configuration field

The reference `{{secret.SECRET_NAME}}` will be copied to your clipboard.

## How It Works

### Execution Flow

```
1. User creates secret "API_KEY" with value "sk-12345"
   → Encrypted and stored in database

2. User configures HTTP step:
   headers: { "Authorization": "Bearer {{secret.API_KEY}}" }

3. Flow executes:
   → Executor detects {{secret.API_KEY}}
   → Retrieves encrypted value from database
   → Decrypts value: "sk-12345"
   → Replaces in settings: "Bearer sk-12345"
   → Executes step with real value

4. Logs show: "Bearer {{secret.API_KEY}}" (never the real value)
```

### Security Features

- **Encryption at Rest**: Secrets are encrypted using AES-256-GCM before storing in database
- **Unique IV**: Each secret has its own initialization vector
- **Authentication Tag**: Ensures data integrity and authenticity
- **No Value Exposure**: Secret values are never returned by the API (only names)
- **Execution-Time Resolution**: Values only exist in memory during execution

## Examples

### Example 1: Email with App Password

**Create Secret:**

- Name: `GMAIL_APP_PASSWORD`
- Value: `abcd efgh ijkl mnop`

**Use in Send Email Step:**

```json
{
  "email": "your-email@gmail.com",
  "appPassword": "{{secret.GMAIL_APP_PASSWORD}}",
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "This is a test"
}
```

### Example 2: HTTP Request with API Key

**Create Secret:**

- Name: `OPENAI_API_KEY`
- Value: `sk-proj-abc123...`

**Use in HTTP Request Step:**

```json
{
  "url": "https://api.openai.com/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{secret.OPENAI_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-4",
    "messages": [{ "role": "user", "content": "Hello" }]
  }
}
```

### Example 3: Multiple Secrets in One Step

```json
{
  "url": "https://api.example.com/data",
  "method": "POST",
  "headers": {
    "X-API-Key": "{{secret.API_KEY}}",
    "X-API-Secret": "{{secret.API_SECRET}}"
  }
}
```

## Managing Secrets

### Updating a Secret

1. Open **Manage Secrets**
2. Find the secret you want to update
3. Click **Edit value**
4. Enter the new value
5. Click **Update**

All flows using this secret will automatically use the new value on next execution.

### Deleting a Secret

1. Open **Manage Secrets**
2. Find the secret you want to delete
3. Click **Delete**
4. Confirm deletion

**Warning**: Flows referencing deleted secrets will fail with error: `Secret not found: SECRET_NAME`

## Error Handling

### Common Errors

**Error: `Secret not found: MY_SECRET`**

- **Cause**: The secret doesn't exist or was deleted
- **Solution**: Create the secret or update the flow to use an existing secret

**Error: `ENCRYPTION_KEY must be set and be 64 hex characters`**

- **Cause**: Missing or invalid encryption key in API environment
- **Solution**: Generate and set a valid encryption key (see Setup section)

**Error: `Invalid encrypted value format`**

- **Cause**: Database corruption or manual modification of encrypted values
- **Solution**: Delete and recreate the secret

## Best Practices

### Do's

- Use descriptive, uppercase names: `GMAIL_APP_PASSWORD`, `STRIPE_API_KEY`
- Rotate secrets regularly (update values periodically)
- Use secrets for all sensitive data (passwords, tokens, API keys)
- Document which flows use which secrets
- Keep encryption key secure and backed up

### Don'ts

- Don't commit secrets to version control
- Don't share secrets in plain text (use the reference syntax)
- Don't use secrets for non-sensitive data (use variables instead)
- Don't delete secrets that are in use without updating flows first
- Don't lose your encryption key (secrets cannot be recovered)

## Secrets vs Variables

| Feature        | Secrets               | Variables            |
| -------------- | --------------------- | -------------------- |
| **Storage**    | Encrypted in database | Plain text in flow   |
| **Visibility** | Hidden (••••••••)     | Visible in UI        |
| **Use Case**   | Passwords, API keys   | Configuration values |
| **Scope**      | Global (all flows)    | Per execution        |
| **Syntax**     | `{{secret.NAME}}`     | `{{vars.name}}`      |

## API Reference

### Endpoints

```
GET    /secrets           # List all secrets (names only)
POST   /secrets           # Create a new secret
PUT    /secrets/:name     # Update a secret value
DELETE /secrets/:name     # Delete a secret
```

### Create Secret

```bash
curl -X POST http://localhost:3000/secrets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MY_SECRET",
    "value": "my-secret-value"
  }'
```

### Update Secret

```bash
curl -X PUT http://localhost:3000/secrets/MY_SECRET \
  -H "Content-Type: application/json" \
  -d '{
    "value": "new-secret-value"
  }'
```

### Delete Secret

```bash
curl -X DELETE http://localhost:3000/secrets/MY_SECRET
```

## Troubleshooting

### Secret Not Resolving

**Symptoms**: Flow executes but secret reference appears as literal text

**Possible Causes**:

1. Typo in secret name (case-sensitive)
2. Secret name doesn't match pattern `[A-Z_][A-Z0-9_]*`
3. Missing `{{` or `}}` brackets

**Solution**: Verify secret name and syntax

### Encryption Key Issues

**Symptoms**: API fails to start or secrets operations fail

**Possible Causes**:

1. `ENCRYPTION_KEY` not set in environment
2. Key is not 64 hex characters (32 bytes)
3. Key changed after secrets were created

**Solution**:

- Ensure key is properly set
- If key was lost, secrets cannot be recovered (must recreate)

## Migration Guide

### From Plain Text to Secrets

If you have flows with hardcoded sensitive values:

1. **Identify sensitive values** in your flows
2. **Create secrets** for each value
3. **Update flows** to use secret references
4. **Test** each flow to ensure secrets resolve correctly
5. **Save** updated flows

**Example Migration:**

Before:

```json
{
  "appPassword": "abcd efgh ijkl mnop"
}
```

After:

```json
{
  "appPassword": "{{secret.GMAIL_APP_PASSWORD}}"
}
```

## Security Considerations

### Encryption Details

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **IV Size**: 128 bits (16 bytes, randomly generated per secret)
- **Auth Tag**: 128 bits (16 bytes, for integrity verification)

### Storage Format

Encrypted values are stored as: `iv:authTag:encryptedData` (all hex-encoded)

### Key Management

**Critical**: The encryption key is the master key for all secrets. If lost:

- All secrets become unrecoverable
- You must recreate all secrets
- Flows will fail until secrets are recreated

**Recommendations**:

- Store encryption key in a secure secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Never commit to version control
- Back up securely
- Rotate periodically (requires re-encrypting all secrets)

## Future Enhancements

Planned features for secrets management:

- [ ] Secret expiration dates
- [ ] Audit log for secret access
- [ ] Secret rotation automation
- [ ] Integration with external secret managers (AWS, Vault)
- [ ] Per-secret access control (when multi-user support is added)
- [ ] Secret usage tracking (which flows use which secrets)
