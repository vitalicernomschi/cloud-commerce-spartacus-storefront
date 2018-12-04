# Configurable routes

TODO: add table of contents

URL to every route in Storefront and Shell App can be configurable and translatable. This means that we don't have to hardcode URLs anymore in:

- `path` and `redirectTo` properties of routes
- directives `routerLink` in HTML templates
- method `Router.navigate` in Typescript code

Instead of it, URLs will be defined only in the Storefront's config under unique route names. And everywhere else only those unique route names will be used.

## Config

The default config for Storefront's pages can be found in [`defaut-storefront-routes-translations.ts`](./config/default-storefront-routes-translations.ts).
```typescript
// defaut-storefront-routes-translations.ts
default: {
    /* ... */
    product: {
        paths: ['product/:productCode'],
        /* ... */
    }
    /* ... */
}
```

However, this config can be extended in the Shell App:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                // `product` is a unique name of the route
                product: { paths: [':productCode/custom/product-path'] }
            }
        }
    }
})
```

**TEMPORARY LIMITIATION:** only English language (`en`) is supported, but it will change in the future


## Navigation links

Navigation links can be automatically generated using `cxTranslateURL` pipe. It can:

1. transform unique route's name into configured URL. For example:
    ```html
    <!-- `product` is a unique name of the route -->
    <a [routerLink]="['product'] | cxTranslateURL: [{ productCode: 1234 }]"`></a>
    ```
    
    ```html
    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```
    **BY CONVENTION**, when pipes' argument is an array, then it's recognized as unique route's name

2. transform default URL into configured URL. For example:
    ```html
    <!-- `cmsData.URL === '/product/1234` is URL of default shape -->
    <a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 
    ```
    ```html
    <!-- result -->
    <a href="1234/custom/product-path"></a>
    ```
    **BY CONVENTION**, when pipes' argument is a string, then it's recognized as an URL of default shape

If pipe cannot translate url due to any reason, it returns the root URL (`/`). Example causes:

- missing translations in config
- typo in the route's name
- unknown shape of default URL

## Routes

To translate paths in routes, they need a specific `data` property `cxPath`. For example:

```typescript
const routes: Routes = [
    {
        data: { cxPath: 'product' } // `product` is a unique name of the route 
        path: null, // Storefront's config will replace this value in bootstrap time
        component: ProductPageComponent
    }
];
```
FAQ:
> Why `path` can't be left `undefined`?

- Because Angular requires any defined `path` in compilation time.


### Current limitations

- only english (`en`) translations are used


### Plans

So we plan to use only abastract page names with in templates and classes. And give possibility to configure route's paths in different languages in StorefrontModule.withConfig

And automatically generate navigation links to those pages in templates.
Ad 1. cxPath / cxRedirectTo - handle abstract page name (that then will be matched with paths from config)
Ad 2. then path/redirectTo has to be null (Angular doesn't allow it to be undefined), that's why those properties are left with null.

### Work in progress:

More ways to extend default routes translations config can be found under this link.
> SPIKE TODO: write doc and add link here

### Whe can pass to links whole entity

### Disabling routes
To disable a route (to remove it from Angular's router config and prevent generating links to this route) it suffices to set `null` for it's unique name in the config:

```typescript
StorefrontModule.withConfig({
    routesConfig: {
        translations: {
            en: {
                product: null // `product` is a unique name of the route
            }
        }
    }
})
```
```html
<!-- `product` is a unique name of the route -->
<a [routerLink]="['product'] | cxTranslateURL: [{ productCode: 1234 }]"`></a>

<!-- result -->
<a href="/"></a>
```
```html
<!-- `cmsData.URL === '/product/1234` is URL of default shape -->
<a [routerLink]="cmsData.URL | cxTranslateURL"`></a> 

<!-- result -->
<a href="/"></a>
```

### Params mapping


### Overriding default URLs
TODO: describe how it populates to all languages and how it changes behaviour of default URLs recognition