namespace Prodjegg.ApiService.Helpers;

public static class UrlHelper
{
    public static string? NormalizeExternalUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return url;

        url = url.Trim();

        if (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            return url;

        return "https://" + url;
    }
}