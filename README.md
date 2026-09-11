# Chinese Study

A small, dependency-free Chinese study app for iPhone Safari and desktop browsers. Generated smart lessons, flashcards, multiple-choice quizzes, matching rounds, and a searchable library cover radicals, characters, words, and sentences. All six directions between Chinese, pinyin, and English are supported. There are no daily quotas.

## Publish with GitHub Pages (no terminal needed)

1. Sign in to GitHub and create a new **public** repository, for example `chinese-study`. Public repositories support Pages on GitHub Free. Your app content will be public; your locally saved progress is not uploaded.
2. In that repository, use **Add file → Upload files** (or the upload link on an empty repository).
3. Upload these files together at the repository root, without enclosing them in another folder:
   - `index.html`
   - `chinese-radicals.html`
   - `style.css`
   - `content.js`
   - `app.js`
   - `sw.js`
   - `manifest.webmanifest`
   - `icon.svg`
   - `icon-192.png`
   - `icon-512.png`
4. Commit the upload to `main`.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then **Save**.
6. Wait for deployment to finish. Pages settings will display the site link, normally `https://YOUR-USERNAME.github.io/chinese-study/`.
7. Open that HTTPS link in Safari on your iPhone. Use **Share → Add to Home Screen** (enable **Open as Web App** if offered), then open the new icon while online.
8. Open **Progress** and wait for **Offline files are ready**. Turn on airplane mode and reopen the Home Screen app to verify it works offline.

GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

`original-draft.html` is a preserved copy of the initial lesson app. It is not required for deployment. No build, account system, analytics, remote fonts, or progress backend is used.

## Study and progress

Study sessions use a full-screen exercise view with the next action pinned at the bottom, so continuing does not depend on scrolling. Library and Progress remain scrollable lists.

The main **Smart lesson** button creates a finite block from previous performance. It combines flashcards, multiple choice, and a two-column Chinese–English matching round. A fresh profile first introduces a four-radical foundation; later lessons normally introduce one new item and mix Learning, Review, and older Familiar material. Characters unlock after three radicals become Familiar, words after five characters, and sentences after three words. Where the content has explicit relationships, higher-level cards wait until their listed prerequisites have been introduced. This is generated progression, not a fixed lesson order.

Smart-lesson items move through **New → Learning → Familiar → Review**. Three consecutive correct answers make an item Familiar; a miss returns it to Learning. Correct answers schedule increasingly spaced reviews, while every lesson also draws from older Familiar material for maintenance. Matching mistakes count against the Chinese card selected on the left; finding its correct partner then records a success.

Choose a level, activity, prompt/answer direction, and item pool. **Everything** repeats a shuffled deck until you stop. **Not practised** finishes after each eligible item has been attempted; **Needs practice** favours low-success items and continues until they no longer need practice or you end the session. Missed items return on the next pass through the pool.

Each activity and direction has its own record. A flashcard answer is self-rated; quiz answers are checked. Library browsing does not count as successful recall. “Mark as seen” records browsing without changing mastery. Familiar means three consecutive successes and a future review time. Correct answers expand the interval (1, 2, 4, 8… days, up to 90); a mistake resets it. This is a simple scheduling heuristic, not a claim of proven mastery. No daily queue is enforced.

Answers and the active session are saved immediately in IndexedDB. Switching to Library or Progress leaves your session available under Study. A refresh restores it. Settings may be changed in Library while a session is paused; the active session keeps its original settings.

## Back up your progress

Use **Progress → Export backup** and save the JSON file in Files/iCloud Drive. **Restore backup** validates the file and asks before replacing current progress. Backups include all activity/direction records and preferences, but not the unfinished session. Nothing automatically syncs to another device.

Use the Home Screen installation consistently. Safari tabs and installed apps can have different storage contexts. Clearing website data, deleting an installation, or changing devices may lose data. Persistent storage is requested when you begin studying, but is not guaranteed. Export before changing the site's domain or repository path: a new address will not automatically inherit old progress.

## Add content or update the app

Edit the arrays in `content.js`. Radicals, combination results, family members, radical examples, word groups, and sentences are converted into individual cards. Duplicate characters use the first entry; curate ambiguous readings or glosses before adding new content. Existing theory text is preserved in the source data but not displayed as lessons. Original content has not received a full linguistic review.

IDs derive from level + Chinese text. Add new entries freely; changing a translation or pinyin preserves progress. Changing Chinese text changes its ID, so treat that as a new item or explicitly migrate the ID. Additional content automatically becomes available as unpractised.

For each release, change `VERSION` in `sw.js` (for example `v1` → `v2`), and upload all modified files in the same commit. The new cache installs and activates while online, and the app reloads once when the new version takes control. If an older installed copy remains visible, fully close its window and reopen it online. IndexedDB progress is independent of cached app files.

## Local preview

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000`. Localhost supports service workers. A plain LAN HTTP address on your phone does not provide the same installation/offline support; use the published HTTPS site for iPhone verification.

## iPhone acceptance check

- Check portrait and landscape layout, larger text, and reachable buttons.
- Try all levels and directions, including long sentence answers.
- Answer a card, force-close the app, and confirm that it resumes without counting the answer twice.
- Export a backup, practise more, then restore the backup and check the counts.
- Once offline files are ready, enable airplane mode, close/reopen, and answer several cards.
- Reconnect and verify progress still remains.

## Automated checks

`gjs tests/core.js` checks all cards and quiz directions, ambiguity filtering, progress separation, and backup validation. `BROWSER_BIN=/path/to/chromium python3 tests/browser.py` runs real browser checks for mobile widths, persistence, restore, and offline operation, served under a repository subpath. These tests do not replace the physical iPhone acceptance check above.
