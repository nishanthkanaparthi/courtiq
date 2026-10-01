export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-royal mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-stone-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-royal mb-2">What we collect</h2>
          <p>
            When you sign in with Google, CourtIQ receives your name and email
            address. CourtIQ never sees or stores your Google password.
          </p>
          <p className="mt-2">
            When you use the app, CourtIQ stores the match and point data you
            enter yourself: opponent names, scores, and stats you log.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-royal mb-2">How we use it</h2>
          <p>
            Your data is used only to run the app for you: showing your own
            matches, history, and analytics. CourtIQ does not sell, share, or
            use your data for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-royal mb-2">Who can see your data</h2>
          <p>
            Each coach's matches and stats are private to that coach. Other
            CourtIQ users cannot see your data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-royal mb-2">Contact</h2>
          <p>
            Questions about this policy can be sent to the email address
            associated with this app in Google Cloud Console.
          </p>
        </section>
      </div>
    </div>
  );
}
