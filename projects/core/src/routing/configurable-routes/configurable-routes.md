# Configurable routes

Links to every route in Storefront and Shell App should to be configurable and translatable. This implies that they shouldn't be hardcoded in:
- Angular's routes config (`path` and `redirectTo` keys)
- HTML templates (`routerLink` directive)
- TypeScript code (`Router.navigate()`)

The default links for Storefront's pages can be found in [defaut-storefront-routes-translations.ts](./config/default-storefront-routes-translations.ts) file.
However this config can be extended when importing `StorefrontModule.withConfig()` in Shell App:
```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: { paths: ['custom-product-path/:productCode'] }
            }
        }
    }
})

```

... where `product` is a unique name of some Angular's route entry. More in next paragraph...

More ways to extend default routes translations config can be found under this link.
> SPIKE TODO: write doc and add link here

## Angular's routes config
Every Angular's route that needs to be configurable and translatable should contain `data.cxPath` property with an unique route name, for example `product`, like here:
```typescript
const routes: Routes = [
    {
        data: { cxPath: 'product' }
        path: null,
        component: ProductPageComponent,
    }
];
```

> Why `path` is empty?
Because it will be replaced by Storefront's configurable routes mechanism in the bootstrap time of the application anyway.
> Why `path` property cannot be omitted?
Because Angular doesn't accept `Route` with undefined `path`. It has to be at least `null`.

## HTML templates
Any navigation link directs to a configurable and translatable route should be automatically generated in template, using `cxTranslateUrl` pipe.

> 
### Current limitations:
- only english (`en`) translations are used


So we plan to use only abastract page names with in templates and classes. And give possibility to configure route's paths in different languages in StorefrontModule.withConfig

And automatically generate navigation links to those pages in templates.
Ad 1. cxPath / cxRedirectTo - handle abstract page name (that then will be matched with paths from config)
Ad 2. then path/redirectTo has to be null (Angular doesn't allow it to be undefined), that's why those properties are left with null.

### Work in progress:
