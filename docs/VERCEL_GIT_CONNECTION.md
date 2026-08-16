# Connect this GitHub repository to Vercel

## One-time GitHub access

1. Sign in to GitHub as `rosleenmwl-bit`.
2. Open **Settings → Applications → Installed GitHub Apps**.
3. Find **Vercel** and select **Configure**.
4. If GitHub asks you to confirm access, choose **Verify via email**, enter the code GitHub sends, and select **Verify**.
5. Under **Repository access**, keep **Only select repositories** selected.
6. Open **Select repositories**, choose `rosleenmwl-bit/enjoy-life7-happy`, and select **Save**.

This grants Vercel access to this repository without granting it access to every repository in the account.

## Connect the Vercel project

1. Open the Vercel project `enjoy-life7-happy`.
2. Go to **Settings → Git**.
3. In **Connected Git Repository**, select **GitHub**.
4. Find `enjoy-life7-happy` in the repository list and select **Connect** beside it.
5. Confirm the page now shows `rosleenmwl-bit/enjoy-life7-happy` and a **Connected** status.

If the repository is missing from the list, select **Adjust GitHub App Permissions →** and repeat the one-time GitHub access steps above.

## Trigger and confirm a deployment

Vercel deploys this project from Git. Do not use `vercel deploy`.

1. Set the repository's commit identity:

   ```powershell
   git config user.email "296506739+rosleenmwl-bit@users.noreply.github.com"
   git config user.name "rosleenmwl-bit"
   ```

2. Commit and push changes to `main`:

   ```powershell
   git add -A
   git commit -m "Describe the change"
   git push origin main
   ```

3. Open the project's **Deployments** page in Vercel.
4. Wait for the newest **Production** deployment to show **Ready**.
5. Open [enjoy-life7-happy.vercel.app](https://enjoy-life7-happy.vercel.app/) and confirm the change is live.
