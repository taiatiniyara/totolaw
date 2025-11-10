"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { globalSearch, SearchResults } from "./actions";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Search, FolderOpen, Calendar, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 2) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await globalSearch(query);
        if (result.success && result.data) {
          setResults(result.data);
        } else {
          setError(!result.success && "error" in result ? result.error : "Search failed");
        }
      } catch (err) {
        setError("An error occurred while searching");
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const totalResults = results
    ? results.cases.length + results.hearings.length + results.evidence.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading as="h1">Search</Heading>
        <p className="text-muted-foreground mt-1">
          Search across cases, hearings, and evidence
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases, hearings, documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !error && query.trim().length >= 2 && results && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
            </span>
          </div>

          {/* Cases Results */}
          {results.cases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Cases ({results.cases.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.cases.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      href={`/dashboard/cases/${caseItem.id}`}
                      className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Heading as="h3" className="truncate">{caseItem.title}</Heading>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary">{caseItem.type}</Badge>
                            <Badge variant="outline">{caseItem.status}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatRelativeTime(new Date(caseItem.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hearings Results */}
          {results.hearings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hearings ({results.hearings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.hearings.map((hearing) => (
                    <Link
                      key={hearing.id}
                      href={`/dashboard/hearings/${hearing.id}`}
                      className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Heading as="h3">{hearing.caseTitle}</Heading>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span>
                              {new Date(hearing.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {hearing.location && (
                              <span className="flex items-center gap-1">
                                • {hearing.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence Results */}
          {results.evidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Evidence ({results.evidence.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.evidence.map((item) => (
                    <Link
                      key={item.id}
                      href={`/dashboard/evidence/${item.id}`}
                      className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Heading as="h3" className="truncate">{item.fileName}</Heading>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{item.fileType}</Badge>
                            <span>
                              {(item.fileSize / 1024).toFixed(1)} KB
                            </span>
                            <span>
                              {formatRelativeTime(new Date(item.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {totalResults === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search terms
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && query.trim().length < 2 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search</p>
              <p className="text-sm mt-2">
                Search across all cases, hearings, and evidence
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
