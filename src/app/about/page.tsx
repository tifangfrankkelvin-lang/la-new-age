export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-brand-orange mb-2">
        About Us
      </p>
      <h1 className="font-display text-4xl uppercase text-brand-navy mb-8">
        Built in Los Angeles, for people who work on their trucks
      </h1>

      <div className="space-y-5 text-brand-steel leading-relaxed">
        <p>
          L.A New Age started with a simple idea: finding the right truck
          part shouldn&apos;t mean digging through a dozen sketchy listings
          or waiting on hold for an hour. We&apos;re based right here in Los
          Angeles, and we source, inspect, and list parts ourselves — so
          what you see is what you get.
        </p>
        <p>
          Whether you&apos;re replacing worn brakes, upgrading suspension,
          or tracking down a part for an older model, we focus on clear
          fitment information, honest condition notes, and straightforward
          communication from the moment you order to the moment it lands
          in your hands — or your bed, if you&apos;re picking up locally.
        </p>
        <p>
          We&apos;re a small operation, which means every order gets a real
          person&apos;s attention. Questions about fitment, condition, or
          shipping? Reach out before you buy — we&apos;d rather answer a
          question upfront than deal with a return.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-6 text-center border-t border-brand-mid/20 pt-10">
        <div>
          <p className="font-display text-lg uppercase text-brand-navy mb-1">
            LA-Based
          </p>
          <p className="text-sm text-brand-mid">
            Local pickup available, shipping nationwide.
          </p>
        </div>
        <div>
          <p className="font-display text-lg uppercase text-brand-navy mb-1">
            Inspected Parts
          </p>
          <p className="text-sm text-brand-mid">
            Every listing checked before it goes up.
          </p>
        </div>
        <div>
          <p className="font-display text-lg uppercase text-brand-navy mb-1">
            Real Support
          </p>
          <p className="text-sm text-brand-mid">
            Questions answered by a person, not a bot.
          </p>
        </div>
      </div>
    </div>
  );
}