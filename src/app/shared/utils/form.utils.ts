import {effect, Signal, untracked, WritableSignal} from '@angular/core';
import {OqtApiMetadataProviderService} from '../../02_quality/oqt-api-metadata-provider.service';

/**
 * with link field a form component can use one of its values and sync it with a centrally stored signal, which can be
 * linked to from other forms aswell. This way we can share a field value between different forms
 * Usage:
 *
 * In StateService:
 * const sharedField1 = signal('');
 *
 * In StateService or FormComponent, depending on persistence requirement on view re-creations:
 * const model = signal({field1: '', field2: ''})
 *
 * In FormComponent:
 * const form = form(model)
 *
 * const stateService = inject(StateService);
 * constructor() {
 *   linkField(this.model, 'field1', this.stateService.sharedField1)
 * }
 *
  */

export function linkField<TModel extends object, K extends keyof TModel>(
  model: WritableSignal<TModel>,
  key: K,
  shared: WritableSignal<TModel[K]>,
): void {
  // shared -> formModel
  effect(() => {
    const sharedValue = shared();
    untracked(() => {
      if (model()[key] !== sharedValue) {
        model.update((m) => ({ ...m, [key]: sharedValue }));
      }
    });
  });

  // formModel -> shared
  effect(() => {
    const localValue = model()[key];
    untracked(() => {
      if (shared() !== localValue) {
        shared.set(localValue);
      }
    });
  });
}

/**
 * one way binded field
 */
export function derivedField<TModel extends object, K extends keyof TModel>(
  model: WritableSignal<TModel>,
  key: K,
  source: Signal<TModel[K]>,
): void {
  effect(() => {
    const value = source();
    untracked(() => {
      if (model()[key] !== value) {
        model.update((m) => ({ ...m, [key]: value }));
      }
    });
  });
}

// a function, not a module-level constant: $localize inside a top-level const
// runs once when the JS module is parsed - before the app's runtime
// loadTranslations() call finishes - and freezes the untranslated text forever.
// A function's body only runs when something calls it, always later.
export function getMeasureOptions(): { value: string; label: string }[] {
  return [
    {value: 'count', label: $localize`count`},
    {value: 'length', label: $localize`length`},
    {value: 'area', label: $localize`area`}
  ];
}

export function getMeasureLabel(measure: string): string {
  return getMeasureOptions().find(option => option.value === measure)?.label ?? measure;
}

export function getFilterFromFormValues(formValues, oqtApiMetadataProviderService: OqtApiMetadataProviderService){
    const topic = formValues.topic;

    if (topic === 'custom-topic') return formValues["topic-filter"];

    //if topic from ohsome-quality-api look it up
    return oqtApiMetadataProviderService.getTopicFilter(topic);

}
